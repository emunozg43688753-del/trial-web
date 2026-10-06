import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

interface CTAProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
}

export function CTA({
  eyebrow = "Siguiente paso",
  title = (
    <>
      Construyamos tu <span className="italic text-accent">capa de inteligencia.</span>
    </>
  ),
  description = "Una conversación de 30 minutos para entender tu operación e identificar dónde la IA genera valor real.",
}: CTAProps) {
  return (
    <section aria-labelledby="cta-title" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="reveal relative overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-16 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="dot-field pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
          <div className="relative">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="cta-title" className="editorial mx-auto mt-6 max-w-3xl text-balance text-4xl text-ink sm:text-6xl">
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-[16px] leading-relaxed text-ink-2">{description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" size="lg" variant="accent" className="w-full sm:w-auto">
                Activar demo gratis de 3 días
                <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
                Habla con un estratega
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
