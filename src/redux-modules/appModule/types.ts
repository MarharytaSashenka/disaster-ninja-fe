import { Stat } from '@k2-packages/bivariate-tools';
import { Modes } from '@k2-packages/map-draw-tools/src/index';

//------------------------------------------------------------------------------
// State
//------------------------------------------------------------------------------
export type StateWithAppModule = {
  appModule: AppModuleState;
};

export type AppModuleState = {
  config: Config;
  mapStyle: MapStyle;
  stats: null | Stat;
  selectedOverlayIndex: number;
  xNumerators: NumeratorWithDenominators[] | null;
  yNumerators: NumeratorWithDenominators[] | null;
  correlationMatrix: CorrelationMatrix | null;
  matrixSelection: MatrixSelection | null;
  colorThemeCurrent: ColorTheme | null;
  legendCells: LegendCells | null;
  selectedPolygon: string | null;
  activeDrawMode: keyof Modes;
  showLoadingIndicator: boolean;
  markers: Marker[];
  sources: {};
};

//------------------------------------------------------------------------------
// Correlations Matrix
//------------------------------------------------------------------------------
export type CorrelationMatrix = (number | null)[][];

//------------------------------------------------------------------------------
// Correlations Matrix
//------------------------------------------------------------------------------
export type MatrixSelection = {
  xNumerator: string | null;
  yNumerator: string | null;
};

//------------------------------------------------------------------------------
// Numerator
//------------------------------------------------------------------------------
export type NumeratorWithDenominators = {
  numeratorId: string;
  denominators: string[];
  selectedDenominator: string;
};

//------------------------------------------------------------------------------
// Denominator
//------------------------------------------------------------------------------
type DenominatorAxis = { label: string; value: string; quality?: number };

export type Denominator = {
  x: Array<DenominatorAxis>;
  y: Array<DenominatorAxis>;
};

export type DenominatorValues = {
  x: string | null;
  y: string | null;
};

export type Config = {
  TILES_API: null | string;
  GRAPHQL_API: null | string;
  BOUNDARIES_API: null | string;
};

export type ColorTheme = Array<{ id: string; color: string }>;

export type MapStyle = {
  version: number;
  layers: any[];
};

export type LegendCells = { label: string; color: string }[];

export type Marker = {
  coordinates: [number, number];
  el: JSX.Element;
  id: string;
};