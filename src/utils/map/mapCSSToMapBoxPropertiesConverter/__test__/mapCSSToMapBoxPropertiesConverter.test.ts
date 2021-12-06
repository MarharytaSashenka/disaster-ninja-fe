import test from 'ava';
import { mapCSSToMapBoxProperties } from '../index';
import { getRequirements } from '../getRequirements';
import { MAP_CSS_MAPBOX } from '../config';

const mapCSS = {
  width: 1,
  'casing-width': 3,
  color: '#FEFEFE',
  'casing-color': 'black',
  opacity: 0.5,
  'casing-opacity': 1,
  dashes: '1,2 ,4',
  'casing-dashes': '1',
  linecap: 'round',
  'casing-linecap': 'square',
  linejoin: 'miter',
  'casing-linejoin': 'bevel',
  'fill-color': 'rgb(255, 255, 255)',
  'fill-opacity': 0.3,
  'icon-image': 'airport',
  'icon-width': 13,
  'icon-height': 12,
  'icon-opacity': 1,
  'font-family': 'Open Sans, Tahoma',
  'font-size': 16,
  'font-weight': 'bold',
  'text-color': 'gray',
  'text-opacity': 1,
  'text-position': 'center',
  'text-offset': 3,
  'max-width': 300,
  text: 'label',
  'text-halo-color': 'red',
  'text-halo-radius': 2,
  offset: 3,
  'casing-offset': 4,
};

test('Generate requirements from mapCSS', (t) => {
  const requirements = getRequirements(MAP_CSS_MAPBOX, mapCSS);
  t.snapshot(requirements);
});

test('Convert mapCSS style to mapBox layers', (t) => {
  const result = mapCSSToMapBoxProperties(mapCSS);
  t.snapshot(result);
});