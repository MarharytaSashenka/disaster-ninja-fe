import { Action } from '@reatom/core';
import { EditableLayers } from '../types';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';

export function createUpdateActionsFromLayersDTO(
  layerId: string,
  layer: EditableLayers,
): Action[][] {
  return createUpdateLayerActions(layerId, {
    meta: {
      description: layer.description,
      copyrights: layer.copyrights,
    },
    settings: {
      id: layerId,
      name: layer.name,
      category: layer.category,
      group: layer.group,
      boundaryRequiredForRetrieval: layer.boundaryRequiredForRetrieval ?? false,
      ownedByUser: layer.ownedByUser,
    },
  });
}