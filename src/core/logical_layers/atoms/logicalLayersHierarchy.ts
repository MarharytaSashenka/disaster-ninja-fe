import { createBindAtom } from '~utils/atoms/createBindAtom';
import { logicalLayersRegistryAtom } from './logicalLayersRegistry';

/**
 * This atom contain categories, and groups of atoms
 * Category and group read once when atom added in registry.
 * Don't mutate category and groups in atom, after it was added in registry - it will be ignored
 * Refreshed when atom added or removed from registry
 * Read only
 * */
export type LogicalLayersHierarchy = Record<
  string,
  { id: string; group?: string; category?: string }
>;
export const logicalLayersHierarchyAtom = createBindAtom(
  {
    register: logicalLayersRegistryAtom.registerLayer,
    unregister: logicalLayersRegistryAtom.unregisterLayer,
  },
  ({ onAction, getUnlistedState }, state: LogicalLayersHierarchy = {}) => {
    onAction('register', (layers) => {
      const newState = { ...state };
      layers.forEach((l) => {
        const { layer } = getUnlistedState(l);
        const { group, category } = layer;
        newState[l.id] = {
          id: l.id,
          group,
          category,
        };
      });
      state = newState;
    });

    onAction('unregister', (layerId) => {
      const newState = { ...state };
      delete newState[layerId];
      state = newState;
    });

    return state;
  },
  '[Shared state] logicalLayersHierarchyAtom',
);