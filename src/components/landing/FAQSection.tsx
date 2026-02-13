import { DesktopFAQ } from './DesktopFAQ';
import { MobileFAQ } from './MobileFAQ';

import { useMediaQuery } from '@/hooks/use-media-query';

export function FAQSection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div id="faq">
      {isDesktop ? <DesktopFAQ /> : <MobileFAQ />}
    </div>
  );
}
