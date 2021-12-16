import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { MapboxLayer } from '@deck.gl/mapbox';
import { createDrawingLayers, drawModes, DrawModeType, editDrawingLayers } from '../constants';
import { layersConfigs } from '../configs';
import { FeatureCollection } from 'geojson';
import { drawnGeometryAtom } from '../atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '../atoms/activeDrawMode';
import { selectedIndexesAtom } from '../atoms/selectedIndexesAtom';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { layersOrderManager } from '~core/logical_layers/layersOrder';
import { setMapInteractivity } from '../setMapInteractivity';
import { drawingIsStartedAtom } from '../atoms/drawingIsStartedAtom';


type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>
}
const completedTypes = ['selectFeature', 'finishMovePosition', 'rotated', 'translated', 'scaled']

export class DrawModeLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public mode?: DrawModeType
  public mountedDeckLayers: mountedDeckLayersType
  public drawnData: FeatureCollection
  private _isMounted = false;
  private _map!: ApplicationMap
  private _createDrawingLayer: DrawModeType | null
  private _editDrawingLayer: DrawModeType | null
  public selectedIndexes: number[] = []

  public constructor(id: string, name?: string) {
    this.id = id;
    this.mountedDeckLayers = {}
    this.drawnData = {
      features: [], type: 'FeatureCollection'
    }
    if (name) {
      this.name = name;
    }
    this._createDrawingLayer = null
    this._editDrawingLayer = null
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onInit() {
    return { isVisible: false, isLoading: false };
  }

  willMount(map: ApplicationMap): void {
    this._map = map
    this._isMounted = true;
  }

  willUnmount(): void {
    this.willHide()
    this._isMounted = false;
  }

  setMode(mode: DrawModeType): any {
    this.mode = mode
    if (!mode) return this.willHide()
    // Case setting mode to create drawings - 
    if (createDrawingLayers.includes(mode)) {
      // Make shure editing mode is Modify mode
      if (!this._editDrawingLayer) this._addDeckLayer(drawModes.ModifyMode)
      this._editDrawingLayer = drawModes.ModifyMode

      // if we had other drawing mode - remove it
      if (this._createDrawingLayer && this._createDrawingLayer !== mode)
        this._removeDeckLayer(this._createDrawingLayer)

      this._addDeckLayer(drawModes[mode])
      this._createDrawingLayer = mode
    }

    // Case setting editing mode - remove drawing mode and add edit mode if needed
    else if (editDrawingLayers.includes(mode)) {
      if (this._createDrawingLayer) {
        this._removeDeckLayer(this._createDrawingLayer)
        this._createDrawingLayer = null
      }
      if (this._editDrawingLayer === mode) return;
      if (!this._editDrawingLayer) {
        this._addDeckLayer(drawModes[mode])
        this._editDrawingLayer = mode
      }
    }
  }

  _addDeckLayer(mode: DrawModeType): void {
    if (this.mountedDeckLayers[mode]) return console.log(`cannot add ${mode} as it's already mounted`);

    const config = layersConfigs[mode]
    // Types for data are wrong. See https://deck.gl/docs/api-reference/layers/geojson-layer#data
    if (mode === drawModes.ModifyMode) {
      config.data = this.drawnData
      config.selectedFeatureIndexes = this.selectedIndexes
      config.onEdit = this._onModifyEdit
    } else {
      config.onEdit = this._onDrawEdit
    }

    config._subLayerProps.guides.pointRadiusMinPixels = 4
    config._subLayerProps.guides.pointRadiusMaxPixels = 4

    const deckLayer = new MapboxLayer({ ...config, renderingMode: '2d' })
    const beforeId = layersOrderManager.getBeforeIdByType(deckLayer.type);

    if (!this._map?.getLayer(deckLayer.id)?.id)
      this._map?.addLayer?.(deckLayer, beforeId);

    this.mountedDeckLayers[mode] = deckLayer
  }

  _removeDeckLayer(mode: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[mode]
    if (!deckLayer) return console.log(`cannot remove ${mode} as it wasn't mounted`);

    this._map.removeLayer(deckLayer.id)
    delete this.mountedDeckLayers[mode]
  }


  updateData(data: FeatureCollection) {
    if (!this._map) return;
    this.drawnData = data
    this._refreshMode(drawModes.ModifyMode)
  }


  _refreshMode(mode: DrawModeType): void {
    const layer = this.mountedDeckLayers[mode]
    // this won't show anything
    // layer?.deck.setProps({ data: this.drawnData })
    layer?.setProps({ data: this.drawnData, selectedFeatureIndexes: this.selectedIndexes })
  }

  willHide(map?: ApplicationMap) {
    if (map && !this._map) this._map = map
    const keys = Object.keys(this.mountedDeckLayers) as DrawModeType[]
    keys.forEach(deckLayer => this._removeDeckLayer(deckLayer))
    this._createDrawingLayer = null
    this._editDrawingLayer = null
  }

  willUnhide() {

  }

  _onModifyEdit = ({ editContext, updatedData, editType }) => {
    let changedIndexes = editContext?.featureIndexes || []

    this.selectedIndexes = changedIndexes
    selectedIndexesAtom.setIndexes.dispatch(changedIndexes)

    // if we selected something being in draw modes
    if (this._createDrawingLayer && editContext.featureIndexes.length) {
      activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode)
    }


    if (updatedData.features?.[0] && completedTypes.includes(editType)) {
      setMapInteractivity(this._map, true)
    } else if (updatedData.features?.[0]) {
      setMapInteractivity(this._map, false)
    }
    drawnGeometryAtom.updateFeatures.dispatch(updatedData.features)
  }

  _onDrawEdit = ({ editContext, updatedData, editType }) => {
    if (editType === 'addTentativePosition' || editType === 'addFeature') drawingIsStartedAtom.setIsStarted.dispatch(true)
    if (editType === 'addFeature' && updatedData.features[0])
      drawnGeometryAtom.addFeature.dispatch(updatedData.features[0]);
  }

  onDataChange() {
    // no data is incoming here
  }
}