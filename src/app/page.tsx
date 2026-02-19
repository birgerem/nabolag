// ============================================================
// Forside – Hovedsiden for Nabolagshjelpen
// ============================================================

import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AppInstallSection from "@/components/home/AppInstallSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AppInstallSection />
    </>
  );
}
