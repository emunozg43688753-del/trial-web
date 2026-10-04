import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "Términos de uso de TRIAL.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos de uso"
      updated="octubre 2026"
      sections={[
        { title: "Aceptación", body: "Al utilizar este sitio aceptas estos términos. Si no estás de acuerdo, por favor no utilices el sitio." },
        { title: "Naturaleza de TRIAL Brain", body: "TRIAL Brain ofrece orientación general generada por inteligencia artificial. No constituye asesoría profesional vinculante y puede contener errores. Valida las decisiones críticas con especialistas." },
        { title: "Uso aceptable", body: "No está permitido usar el sitio para actividades ilícitas, intentar vulnerar su seguridad o automatizar solicitudes de forma abusiva." },
        { title: "Propiedad intelectual", body: "El contenido, diseño y marca TRIAL son propiedad de sus titulares. No pueden reproducirse sin autorización." },
        { title: "Limitación de responsabilidad", body: "El sitio se ofrece tal cual. TRIAL no será responsable de daños derivados del uso de la información proporcionada." },
      ]}
    />
  );
}
