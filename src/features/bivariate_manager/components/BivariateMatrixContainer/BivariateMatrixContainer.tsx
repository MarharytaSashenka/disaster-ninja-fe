import { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import ConnectedBivariateMatrix from '~features/bivariate_manager/components/ConnectedBivariateMatrix/ConnectedBivariateMatrix';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { createStateMap } from '~utils/atoms';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { BivariateGreetingsContainer } from '~features/bivariate_manager/components/BivariateGreetings/BivariateGreetingsContainer';
import { i18n } from '~core/localization';
import { focusedGeometryAtom } from '~core/shared_state';
import { isGeometryEmpty } from '~features/bivariate_manager/utils/createBivariateGraphQLQuery';
import s from './BivariateMatrixContainer.module.css';

interface BivariateMatrixContainerProps {
  className?: string;
}

const BivariateMatrixContainer = ({ className }: BivariateMatrixContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useRef<{ w: number; h: number } | null>(null);

  const statesToComponents = createStateMap(useAtom(bivariateStatisticsResourceAtom)[0]);

  function updateDimensions() {
    if (!containerRef.current || !dimensions.current) return;
    containerRef.current.style.width = `${dimensions.current.w}px`;
    containerRef.current.style.height = `${dimensions.current.h}px`;
  }

  const onRefChange = useCallback((ref: HTMLDivElement | null) => {
    if (!ref) return;

    const dim = ref.getClientRects()[0];
    // coeff 0.7 here is because of transform: scale(0.7) applied to matrix
    const baseDim = parseFloat(ref.getAttribute('base-dimension') || '0') * 0.7;
    const newWidth = baseDim + dim.width + 18;
    const newHeight = dim.height + 105;
    if (
      !dimensions.current ||
      Math.abs(dimensions.current.w - newWidth) > 3 ||
      Math.abs(dimensions.current.h - newHeight) > 3
    ) {
      dimensions.current = { w: newWidth, h: newHeight };
      updateDimensions();
    }
  }, []);

  useEffect(updateDimensions, [containerRef]);

  return (
    <div
      id="bivariate-matrix-container"
      className={clsx(s.bivariateContainer, className)}
      ref={containerRef}
    >
      <div>
        {statesToComponents({
          loading: (
            <div className={s.loadingContainer}>
              <LoadingSpinner />
            </div>
          ),
          error: () => (
            <div className={s.errorContainer}>
              <ErrorMessage message="Unfortunately, we cannot display the matrix. Try refreshing the page or come back later." />
            </div>
          ),
          ready: () => (
            <>
              <PanelHeader />
              <div className={s.matrixContainer}>
                <ConnectedBivariateMatrix ref={onRefChange} />
              </div>
              <BivariateGreetingsContainer className={s.greetings} />
            </>
          ),
        })}
      </div>
    </div>
  );
};

const PanelHeader = () => {
  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const haveGeometry = !isGeometryEmpty(focusedGeometry);

  return (
    <div className={s.header}>
      <Text type="heading-l">{i18n.t('bivariate.matrix.header.title')}</Text>
      {haveGeometry && (
        <div className={s.hint}>{i18n.t('bivariate.matrix.header.hint')}</div>
      )}
    </div>
  );
};

export default BivariateMatrixContainer;
