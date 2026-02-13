import { DesktopPricing } from './DesktopPricing';
import { MobilePricing } from './MobilePricing';

import { useMediaQuery } from '@/hooks/use-media-query';

export function PricingSection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div id="precos">
      {isDesktop ? <DesktopPricing /> : <MobilePricing />}
    </div>
  );
}
