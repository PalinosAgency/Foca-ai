import { DesktopFAQ } from './DesktopFAQ';
import { MobileFAQ } from './MobileFAQ';

export function FAQSection() {
  return (
    <div id="faq">
      <DesktopFAQ />
      <MobileFAQ />
    </div>
  );
}
