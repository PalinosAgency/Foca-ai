import { DesktopPricing } from './DesktopPricing';
import { MobilePricing } from './MobilePricing';

export function PricingSection() {
  return (
    <div id="precos">
      <DesktopPricing />
      <MobilePricing />
    </div>
  );
}
