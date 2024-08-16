import { useTranslation } from 'next-i18next';

export function SpaceSidebarHeaderLeft() {
  const { t } = useTranslation('common');

  return <div className="m-2 flex justify-start items-center">{t('space.allSpaces')}</div>;
}
