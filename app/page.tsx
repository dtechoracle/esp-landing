import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import TrustStrip from "./components/TrustStrip";
import AssistantSection from "./components/AssistantSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ProofSection from "./components/ProofSection";
import RolesSection from "./components/RolesSection";
import FaqSection from "./components/FaqSection";
import FinalCtaSection from "./components/FinalCtaSection";
import Footer from "./components/Footer";
import StickyCta from "./components/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <HeroSection />
        <TrustStrip />
        <AssistantSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProofSection />
        <RolesSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
