import { DesktopFeatures } from './DesktopFeatures';
import { MobileFeatures } from './MobileFeatures';

import { useMediaQuery } from '@/hooks/use-media-query';

export function FeaturesSection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div id="como-funciona">
      {isDesktop ? <DesktopFeatures /> : <MobileFeatures />}
    </div>
  );
}
