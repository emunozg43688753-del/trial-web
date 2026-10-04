import { ButtonLink } from "@/components/ui/button";
import { NeuralCore } from "@/components/ui/neural-core";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-5 py-40 text-center">
      <NeuralCore className="size-12" />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="editorial mt-4 max-w-lg text-5xl text-ink">Esta ruta no existe todavía.</h1>
      <p className="mt-4 max-w-sm text-ink-2">Quizá TRIAL Brain pueda ayudarte a encontrar lo que buscas.</p>
      <div className="mt-10 flex gap-3">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/intelligence" variant="secondary">Abrir Intelligence</ButtonLink>
      </div>
    </section>
  );
}
