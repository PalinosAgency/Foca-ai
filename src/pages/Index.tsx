/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
// Importando os novos componentes
import { DesktopHero } from '@/components/landing/DesktopHero';
import { MobileHero } from '@/components/landing/MobileHero';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';

import { useMediaQuery } from '@/hooks/use-media-query';

export default function Index() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="min-h-screen font-sans bg-background">
      <Navbar />

      {/* --- SETOR 1: HERO (AZUL ESCURO) --- */}
      {isDesktop ? <DesktopHero /> : <MobileHero />}

      {/* --- SETOR 2: FEATURES (BRANCO/CINZA CLARO) --- */}
      <FeaturesSection />

      {/* --- SETOR 3: DASHBOARD (AZUL ESCURO) --- */}
      <DashboardPreview />

      {/* --- SETOR 4: BENEFÍCIOS (BRANCO) --- */}
      <BenefitsSection />

      {/* --- SETOR 5: PREÇOS (AZUL ESCURO) --- */}
      <PricingSection />

      {/* --- SETOR 6: FAQ (BRANCO) --- */}
      <FAQSection />

      {/* CTA Final REMOVIDO conforme solicitado */}

      <Footer />
    </div>
  );
}