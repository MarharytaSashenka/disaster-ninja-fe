import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';

export function Reports() {
  return (
    <div>
      <AppHeader title={`Disaster Ninja ${i18n.t('Reports')}`} />
      <ReportsList />
    </div>
  );
}
