import { createAtom } from '@reatom/core';
import { LogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';

export const logicalLayersRegistryAtom = createAtom(
  {
    registerLayer: (logicalLayer: LogicalLayerAtom) => logicalLayer,
    unregisterLayer: (logicalLayerId: LogicalLayerAtom['id']) => logicalLayerId,
  },
  (
    { onAction },
    state: Record<LogicalLayerAtom['id'], LogicalLayerAtom> = {},
  ) => {
    onAction('registerLayer', (logicalLayer) => {
      logicalLayer.init.dispatch();
      state = { ...state, [logicalLayer.id]: logicalLayer };
    });
    onAction('unregisterLayer', (logicalLayerId) => {
      const copy = { ...state };
      delete copy[logicalLayerId];
      state = copy;
    });
    return state;
  },
);