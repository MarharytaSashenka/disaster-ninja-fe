import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { focusedGeometryAtom } from '~core/shared_state';

export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ get, schedule, getUnlistedState }) => {
    const { data: layersInArea, loading } = get('layersInAreaResourceAtom');

    if (layersInArea && !loading) {
      const currentRegistry = getUnlistedState(logicalLayersRegistryAtom);
      const registry = new Set(Object.keys(currentRegistry));
      const newLayers = layersInArea.filter((l) => !registry.has(l.id));
      /* Create logical layers and wrap into atoms */
      const logicalLayersAtoms = newLayers.map((layer) =>
        createLogicalLayerAtom(new GenericLayer(layer), focusedGeometryAtom),
      );
      if (logicalLayersAtoms.length > 0) {
        /* Batch actions into one transaction */
        schedule((dispatch) => {
          dispatch(logicalLayersRegistryAtom.registerLayer(logicalLayersAtoms));
        });
      }
    }
  },
  'layersInAreaLogicalLayers',
);
