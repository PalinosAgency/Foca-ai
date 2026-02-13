import { DesktopDashboardPreview } from './DesktopDashboardPreview';
import { MobileDashboardPreview } from './MobileDashboardPreview';
import { useMediaQuery } from '@/hooks/use-media-query';

export function DashboardPreview() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? <DesktopDashboardPreview /> : <MobileDashboardPreview />}
    </>
  );
}
