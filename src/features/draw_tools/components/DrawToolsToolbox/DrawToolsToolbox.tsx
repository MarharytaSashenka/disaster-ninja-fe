import { Button, Text } from '@k2-packages/ui-kit';
import { useCallback, useState } from 'react';
import { TranslationService as i18n } from '~core/localization';
import s from './DrawToolToolbox.module.css';
import {
  DrawLineIcon,
  DrawPointIcon,
  DrawPolygonIcon,
  TrashBinIcon,
} from '@k2-packages/default-icons';
import { useAtom } from '@reatom/react';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import clsx from 'clsx';
import { CLOSE_DRAW_HINT, drawModes, DrawModeType } from '~features/draw_tools/constants';
import { modeWatcherAtom } from '~features/draw_tools/atoms/drawLayerAtom';
import { selectedIndexesAtom } from '~features/draw_tools/atoms/selectedIndexesAtom';
import { drawnGeometryAtom } from '~features/draw_tools/atoms/drawnGeometryAtom';

export const DrawToolsToolbox = () => {
  const [activeDrawMode, { setDrawMode, toggleDrawMode }] = useAtom(activeDrawModeAtom);
  const [selected] = useAtom(selectedIndexesAtom)
  const [, { removeByIndexes }] = useAtom(drawnGeometryAtom)
  useAtom(modeWatcherAtom);

  const [hintShown, setHintShown] = useState(
    window.localStorage.getItem(CLOSE_DRAW_HINT) !== 'true',
  )

  const onClick = useCallback(
    (modeId: string) => {
      const mode: DrawModeType = drawModes[modeId] || drawModes.ModifyMode;
      toggleDrawMode(mode);
    },
    [toggleDrawMode],
  );

  const finishDrawing = useCallback(
    () => {
      setDrawMode(undefined);
    },
    [setDrawMode],
  );

  const onDelete = useCallback(
    () => {
      if (selected.length) removeByIndexes(selected)
    },
    [selected],
  );

  const closeHint = useCallback(
    () => {
      setHintShown(false)
      window.localStorage.setItem(CLOSE_DRAW_HINT, 'true');
    },
    [setHintShown],
  );


  return activeDrawMode ? (
    <div>
      {hintShown && <div className={s.drawHint} onClick={closeHint}>
        <Text type="caption">
          <span className={s.drawHintText}>{i18n.t('Click on the map to begin drawing')}</span>
        </Text>
      </div>}

      <div className={s.drawToolsContainer}>
        <Button id={drawModes.DrawPolygonMode} active={activeDrawMode === drawModes.DrawPolygonMode} onClick={() => onClick(drawModes.DrawPolygonMode)}>
          <div className={s.btnContainer}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button id={drawModes.DrawLineMode} active={activeDrawMode === drawModes.DrawLineMode} onClick={() => onClick(drawModes.DrawLineMode)}>
          <div className={s.btnContainer}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button id={drawModes.DrawPointMode} active={activeDrawMode === drawModes.DrawPointMode} onClick={() => onClick(drawModes.DrawPointMode)}>
          <div className={s.btnContainer}>
            <DrawPointIcon /> {i18n.t('Point')}
          </div>
        </Button>
        <Button active={Boolean(selected.length)} onClick={onDelete}>
          <div className={s.btnContainer}>
            <TrashBinIcon />
          </div>
        </Button>
        {/* this is temporary  */}
        <Button className={s.finishBtn} onClick={() => finishDrawing()}>
          <div className={clsx(s.btnContainer)}>{i18n.t('Finish Drawing')}</div>
        </Button>
      </div>
    </div>
  ) : null;
};
