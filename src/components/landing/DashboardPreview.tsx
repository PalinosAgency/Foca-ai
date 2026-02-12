import { DesktopDashboardPreview } from './DesktopDashboardPreview';
import { MobileDashboardPreview } from './MobileDashboardPreview';

export function DashboardPreview() {
  return (
    <>
      <DesktopDashboardPreview />
      <MobileDashboardPreview />
    </>
  );
}
