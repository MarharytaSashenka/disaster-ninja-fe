import { useEffect, useState } from 'react';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';
import { DownloadControl } from '../DownloadControl/DownloadControl';
import { LayerContextMenu } from '../LayerContextMenu/LayerContextMenu';

export function useControlElements(
  layerState: LogicalLayerState,
  layerActions: {
    hide: () => void;
    show: () => void;
    download: () => void;
  },
) {
  const [controlElements, setControlElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const elements: JSX.Element[] = [];
    if (layerState.isMounted)
      elements.push(
        <LayerHideControl
          key={layerState.id + 'hide'}
          isVisible={layerState.isVisible}
          hideLayer={layerActions.hide}
          unhideLayer={layerActions.show}
        />,
      );
    if (layerState.isMounted && layerState.isDownloadable)
      elements.push(
        <DownloadControl
          key={layerState.id + 'download'}
          startDownload={layerActions.download}
        />,
      );

    if (layerState?.contextMenu)
      elements.push(
        <LayerContextMenu
          contextMenu={layerState.contextMenu}
          key={layerState.id + 'context'}
        />,
      );

    if (layerState.meta) {
      elements.push(<LayerInfo key={layerState.id} meta={layerState.meta} />);
    }

    setControlElements(elements);
  }, [layerState, layerActions]);

  return controlElements;
}