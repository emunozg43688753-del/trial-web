import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { SolutionsGrid } from "@/components/solutions/solution-card";
import { PageHero, Section } from "@/components/ui/section";
import { solutions } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Soluciones de Inteligencia de TRIAL: automatización, agentes autónomos, experiencia de cliente, ventas, operaciones, conocimiento, estrategia y sistemas a medida.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Soluciones de Inteligencia"
        title="Ocho capacidades. Un mismo objetivo: amplificar a tu equipo."
        description="Cada solución nace de un problema concreto del negocio y se diseña para integrarse con las herramientas y personas que ya tienes."
      />
      <Section className="py-16 sm:py-24">
        <SolutionsGrid items={solutions} />
      </Section>
      <CTA />
    </>
  );
}
