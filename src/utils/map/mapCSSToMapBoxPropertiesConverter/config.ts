// FORM https://wiki.openstreetmap.org/wiki/MapCSS/0.2
// TO https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/

/*
 * "casing_line" not exist in mapBox type,
 * but it required for generating additional layer of type "line" (one-type -> one-layer)
 */
export const MAP_CSS_MAPBOX = {
  // Line
  width: {
    type: 'line',
    category: 'paint',
    name: 'line-width',
    valueConverter: 'toNumber',
  },
  'casing-width': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-width',
    valueConverter: 'relativeCasingLineWith',
  },
  color: {
    type: 'line',
    category: 'paint',
    name: 'line-color',
    valueConverter: null,
  },
  'casing-color': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-color',
    valueConverter: null,
  },
  opacity: {
    type: 'line',
    category: 'paint',
    name: 'line-opacity',
    valueConverter: 'toNumber',
  },
  'casing-opacity': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-opacity',
    valueConverter: 'toNumber',
  },
  dashes: {
    type: 'line',
    category: 'paint',
    name: 'line-pattern',
    valueConverter: 'splitByComma',
  },
  'casing-dashes': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-pattern',
    valueConverter: 'splitByComma',
  },
  linecap: {
    type: 'line',
    category: 'layout',
    name: 'line-cap',
    valueConverter: null, // "round" and "square" as is
  },
  'casing-linecap': {
    type: 'casing_line',
    category: 'layout',
    name: 'line-cap',
    valueConverter: null, // "round" and "square" as is
  },
  linejoin: {
    type: 'line',
    category: 'layout',
    name: 'line-join',
    valueConverter: null, // "bevel" and "miter" as is
  },
  'casing-linejoin': {
    type: 'casing_line',
    category: 'layout',
    name: 'line-join',
    valueConverter: null, // "bevel" and "miter" as is
  },
  // fill
  'fill-color': {
    type: 'fill',
    category: 'paint',
    name: 'fill-color',
    valueConverter: null,
  },
  'fill-opacity': {
    type: 'fill',
    category: 'paint',
    name: 'fill-opacity',
    valueConverter: 'toNumber',
  },
  // symbol
  'icon-image': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-image',
    valueConverter: null,
  },
  'icon-width': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-size',
    valueConverter: 'toNumber',
  },
  'icon-height': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-size', // overnight icon-width
    valueConverter: 'toNumber',
  },
  'icon-opacity': {
    type: 'symbol',
    category: 'paint',
    name: 'icon-opacity',
    valueConverter: 'toNumber',
  },
  // font
  'font-family': {
    type: 'symbol',
    category: 'layout',
    name: 'text-font',
    valueConverter: 'splitByComma',
  },
  'font-size': {
    type: 'symbol',
    category: 'layout',
    name: 'text-size',
    valueConverter: 'toNumber',
  },
  'font-weight': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-width',
    valueConverter: null,
  },
  // "font-style": { // * Not supported
  //   "type": "symbol",
  // },
  // "font-variant": { // * Not supported
  //   "type": "symbol",
  // },
  // "text-decoration": { // * Not supported
  //   "type": "symbol",
  // },
  'text-transform': {
    type: 'symbol',
    category: 'layout',
    name: 'text-transform',
    valueConverter: null,
  },
  'text-color': {
    type: 'symbol',
    category: 'paint',
    name: 'icon-color',
    valueConverter: null,
  },
  'text-opacity': {
    type: 'symbol',
    category: 'paint',
    name: 'icon-opacity',
    valueConverter: 'toNumber',
  },
  'text-position': {
    type: 'symbol',
    category: 'layout',
    name: 'symbol-placement',
    valueConverter: 'convertPlacement',
  },
  'text-offset': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-offset',
    valueConverter: 'convertOffset',
  },
  'max-width': {
    type: 'symbol',
    category: 'layout',
    name: 'text-max-width',
    valueConverter: 'toNumber',
  },
  text: {
    type: 'symbol',
    category: 'layout',
    name: 'text-field',
    valueConverter: null,
  },
  'text-halo-color': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-color',
    valueConverter: null,
  },
  'text-halo-radius': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-width',
    valueConverter: null,
  },
  // Extra
  offset: [
    {
      type: 'line',
      category: 'paint',
      name: 'line-offset',
      valueConverter: 'toNumber',
    },
    {
      type: 'casing_line',
      category: 'paint',
      name: 'line-offset',
      valueConverter: 'applyCasingOffset',
    },
  ],
  'casing-offset': null, // used only in value converter acceptCasingOffset
};