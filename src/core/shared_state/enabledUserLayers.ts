import { createAtom } from '@reatom/core';

export const enabledLayersAtom = createAtom(
  {
    enableLayer: (layer: string) => layer,
    disableLayer: (layerId: string) => layerId,
    setLayers: (layersIds: string[]) => layersIds,
    disableAllLayers: () => null,
  },
  ({ onAction }, state: string[] = []) => {
    onAction(
      'enableLayer',
      (layer) => (state = Array.from(new Set([...state, layer]))),
    );
    onAction(
      'disableLayer',
      (layerId) => (state = state.filter((layer) => layer !== layerId)),
    );
    onAction(
      'setLayers',
      (layersIds) => (state = Array.from(new Set(layersIds))),
    );

    return state;
  },
);