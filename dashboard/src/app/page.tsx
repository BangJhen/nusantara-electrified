"use client";

import dynamic from "next/dynamic";
import ScrollProgress from "@/components/layout/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import AdoptionSection from "@/components/sections/AdoptionSection";
import BarriersSection from "@/components/sections/BarriersSection";
import ClosingSection from "@/components/sections/ClosingSection";

const InfrastructureSection = dynamic(
  () => import("@/components/sections/InfrastructureSection"),
  { ssr: false }
);
const EmissionSection = dynamic(
  () => import("@/components/sections/EmissionSection"),
  { ssr: false }
);
const IndustrySection = dynamic(
  () => import("@/components/sections/IndustrySection"),
  { ssr: false }
);
const ParadoxSection = dynamic(
  () => import("@/components/sections/ParadoxSection"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />
      <HeroSection />
      <AdoptionSection />
      <InfrastructureSection />
      <EmissionSection />
      <IndustrySection />
      <ParadoxSection />
      <BarriersSection />
      <ClosingSection />
    </main>
  );
}
