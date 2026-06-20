/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
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
