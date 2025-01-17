import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { BivariateMatrix24 } from '@konturio/default-icons';
import ReactDOM from 'react-dom';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import styles from './BivariatePanel.module.css';

const CustomClosePanelBtn = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
    <path
      d="M1 1L7 7L1 13"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="square"
      strokeLinejoin="bevel"
    />
  </svg>
);

const LazyLoadedBivariateMatrixContainer = lazy(
  () => import('../BivariateMatrixContainer/BivariateMatrixContainer'),
);

export function BivariatePanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = '';
    }
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    // need this to temporary hide intercom when showing bivariate
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = 'none';
    }
  }, [setIsOpen]);

  return (
    <>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
        <Panel
          onClose={onPanelClose}
          className={clsx(
            styles.bivariatePanel,
            isOpen && styles.show,
            !isOpen && styles.hide,
          )}
          classes={{
            closeBtn: styles.customCloseBtn,
          }}
          customCloseBtn={<CustomClosePanelBtn />}
        >
          <div className={styles.panelBody}>
            {isOpen && <LazyLoadedBivariateMatrixContainer />}
          </div>
        </Panel>
      </PanelWrap>

      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(
              styles.panelIcon,
              isOpen && styles.hide,
              !isOpen && styles.show,
            )}
            icon={<BivariateMatrix24 />}
          />,
          iconsContainerRef.current,
        )}
    </>
  );
}
