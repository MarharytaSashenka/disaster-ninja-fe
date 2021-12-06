import { createLogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';
import { MAP_RULER_LAYER_ID } from '../constants';
import { MapRulerLayer } from '~features/map_ruler/layers/MapRulerLayer';

export const mapRulerLogicalLayerAtom = createLogicalLayerAtom(
  new MapRulerLayer(MAP_RULER_LAYER_ID),
);