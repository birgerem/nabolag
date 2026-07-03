// ============================================================
// Forside – Hovedsiden for Nabolagshjelpen
// ============================================================

import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import AppInstallSection from "@/components/home/AppInstallSection";

export const metadata: Metadata = {
  title: "Nabolagshjelpen – Trygg hjelp på Tromøya",
  description:
    "Lokal ungdomsbedrift på Tromøya drevet av Edvard (13). Vi hjelper deg med gressklipping, snømåking, handling, matlaging, rydding og annet. 160 kr/time.",
  alternates: {
    canonical: "https://www.nabolagshjelpen.com",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AppInstallSection />
    </>
  );
}
