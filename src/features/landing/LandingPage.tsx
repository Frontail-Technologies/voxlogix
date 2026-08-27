import { Bebas_Neue } from "next/font/google";
import {
  AITroubleshootingSection,
  BeforeAfterSection,
  EnterpriseTrustSection,
  FAQSection,
  FinalCTASection,
  Footer,
  Hero,
  HowItWorksSection,
  ModulesSection,
  Navbar,
  PredictiveMaintenanceSection,
  PricingSection,
  ProblemSection,
  ReportingSection,
  SmoothScroll,
  SolutionsSection,
} from "./components";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

export function LandingPage() {
  return (
    <div className={`landing-root ${bebasNeue.variable}`}>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorksSection />
        <ModulesSection />
        <AITroubleshootingSection />
        <PredictiveMaintenanceSection />
        <SolutionsSection />
        <ReportingSection />
        <EnterpriseTrustSection />
        <BeforeAfterSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
