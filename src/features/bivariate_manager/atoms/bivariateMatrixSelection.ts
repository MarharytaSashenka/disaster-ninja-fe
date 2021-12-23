import { createBindAtom } from '~utils/atoms';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { BivariateLayerStyle, generateColorThemeAndBivariateStyle } from '~utils/bivariate/bivariateColorThemeUtils';
import { createBivariateLegend } from '~utils/bivariate/bivariateLegendUtils';
import { ColorTheme } from '~appModule/types';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { BivariateLayer } from '~features/bivariate_manager/layers/BivariateLayer';
import { bivariateNumeratorsAtom } from '~features/bivariate_manager/atoms/bivariateNumerators';

export const bivariateMatrixSelectionAtom = createBindAtom(
  {
    setMatrixSelection: (xNumerator: string | null, yNumerator: string | null) => ({ xNumerator, yNumerator }),
  },
  ({ onAction, schedule, getUnlistedState }, state: { xNumerator: string | null, yNumerator: string | null } = {
    xNumerator: null,
    yNumerator: null,
  }) => {
    onAction('setMatrixSelection', (selection) => {
      state = selection;

      const { xNumerator, yNumerator } = selection;
      if (xNumerator === null || yNumerator === null) return;

      const { xNumerators, yNumerators } = getUnlistedState(bivariateNumeratorsAtom);
      const stats = getUnlistedState(bivariateStatisticsResourceAtom).data.polygonStatistic.bivariateStatistic;

      if (!xNumerators || !yNumerators || !xNumerators.length || !yNumerators.length) return;

      const xDenominator = xNumerators.find((num) => num.numeratorId === xNumerator)
        ?.selectedDenominator;
      const yDenominator = yNumerators.find((num) => num.numeratorId === yNumerator)
        ?.selectedDenominator;

      if (!xDenominator || !yDenominator) return;

      const res = generateColorThemeAndBivariateStyle(
        xNumerator,
        xDenominator,
        yNumerator,
        yDenominator,
        stats
      );
      if (res) {
        const [colorTheme, bivariateStyle] = res;
        const legend = createBivariateLegend(
          'Bivariate Layer',
          colorTheme as ColorTheme,
          xNumerator,
          xDenominator,
          yNumerator,
          yDenominator,
          stats,
        );

        if (legend) {
          const layer = createLogicalLayerAtom(
            new BivariateLayer(
              'Bivariate Layer',
              bivariateStyle as BivariateLayerStyle,
              legend,
            ),
          );

          let layerToUnreg: string;

          const currentRegistry = getUnlistedState(logicalLayersRegistryAtom);
          for (const [layerId, layer] of Object.entries(currentRegistry)) {
            if (getUnlistedState(layer).layer.name === 'Bivariate Layer') {
              layerToUnreg = layerId;
              logicalLayersRegistryAtom.unregisterLayer(layerId)
              break;
            }
          }

          schedule((dispatch) => {
            dispatch(logicalLayersRegistryAtom.registerLayer(layer));
            dispatch(layer.mount());
            if (layerToUnreg) {
              dispatch(logicalLayersRegistryAtom.unregisterLayer(layerToUnreg))
            }
          });
        }
      }

    });

    return state;
  },
  'bivariateMatrixSelection',
);
