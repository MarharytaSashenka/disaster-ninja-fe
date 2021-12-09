import { activeDrawModeAtom } from './activeDrawMode';
import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DRAW_TOOLS_LAYER_ID } from '../constants';
import { DrawModeLayer } from '../layers/DrawModeLayer';
import { drawnGeometryAtom } from './drawnGeometryAtom';
import { currentMapAtom } from '~core/shared_state';


const drawModeLayer = new DrawModeLayer(DRAW_TOOLS_LAYER_ID)

export const drawLayerAtom = createLogicalLayerAtom(drawModeLayer, drawnGeometryAtom)

export const modeWatcherAtom = createBindAtom(
  {
    drawLayerAtom,
    activeDrawModeAtom,
    drawnGeometryAtom,
  },
  ({ onChange, schedule },) => {
    onChange('activeDrawModeAtom', (mode) => {
      schedule(dispatch => dispatch(currentMapAtom.setInteractivity(true)))
      if (!mode) return schedule(dispatch => dispatch(drawLayerAtom.hide()))

      if (!drawLayerAtom.getState().isMounted) return schedule(dispatch => dispatch(activeDrawModeAtom.setDrawMode(undefined)))
      drawModeLayer.setMode(mode)
    });

    onChange('drawnGeometryAtom', data => {
      drawModeLayer.updateData(data)
    })
  },
);
