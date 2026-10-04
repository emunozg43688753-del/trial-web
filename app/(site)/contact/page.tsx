import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Habla con TRIAL. Cuéntanos tu proceso y diseñaremos una solución de inteligencia a medida.",
  alternates: { canonical: "/contact" },
};

const STEPS = [
  { k: "01", t: "Nos cuentas tu contexto", d: "Proceso, equipo y objetivo." },
  { k: "02", t: "Sesión de descubrimiento", d: "30 minutos con un estratega de IA." },
  { k: "03", t: "Propuesta concreta", d: "Casos priorizados, arquitectura y plan." },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-70" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" /> Contacto
          </p>
          <h1 className="editorial mt-6 text-5xl text-ink animate-fade-up sm:text-7xl">
            Habla con <span className="italic text-accent">TRIAL.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Cuéntanos qué quieres transformar. Te respondemos con una perspectiva clara, no con un folleto.
          </p>

          <ol className="mt-12 space-y-0">
            {STEPS.map((s) => (
              <li key={s.k} className="flex gap-5 border-t border-line py-5">
                <span className="font-mono text-[11px] text-accent">{s.k}</span>
                <div>
                  <p className="text-[15px] font-medium text-ink">{s.t}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink-3">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[13.5px] text-ink-3">
            ¿Prefieres email?{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-ink underline underline-offset-4 hover:text-accent">
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
