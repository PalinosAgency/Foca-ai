import { DesktopBenefits } from './DesktopBenefits';
import { MobileBenefits } from './MobileBenefits';

import { useMediaQuery } from '@/hooks/use-media-query';

export function BenefitsSection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? <DesktopBenefits /> : <MobileBenefits />}
    </>
  );
}
