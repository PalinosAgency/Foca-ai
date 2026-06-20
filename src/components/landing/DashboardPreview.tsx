/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
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
