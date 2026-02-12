import { DesktopFeatures } from './DesktopFeatures';
import { MobileFeatures } from './MobileFeatures';

export function FeaturesSection() {
  return (
    <div id="como-funciona">
      <DesktopFeatures />
      <MobileFeatures />
    </div>
  );
}
