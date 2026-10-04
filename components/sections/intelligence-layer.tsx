import { Eye, GitBranch, Zap } from "lucide-react";

const LAYERS = [
  {
    icon: Eye,
    verb: "Percibe",
    title: "Entiende tu operación",
    body: "Lee correos, documentos, conversaciones y datos de tus sistemas. Convierte el ruido en contexto.",
  },
  {
    icon: GitBranch,
    verb: "Razona",
    title: "Decide con criterio",
    body: "Aplica tus reglas, tu conocimiento y tus prioridades. Sabe cuándo actuar y cuándo preguntar.",
  },
  {
    icon: Zap,
    verb: "Actúa",
    title: "Ejecuta junto a tu equipo",
    body: "Opera en tus herramientas, escala a personas cuando importa y aprende de cada resultado.",
  },
];

/** The central question of the experience, framed as an intelligence layer. */
export function IntelligenceLayer() {
  return (
    <section aria-labelledby="layer-title" className="border-y border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="eyebrow reveal mb-8">La pregunta central</p>
        <h2 id="layer-title" className="editorial reveal max-w-4xl text-balance text-4xl text-ink sm:text-6xl lg:text-[4.25rem]">
          ¿Qué podrías hacer si tu empresa tuviera una{" "}
          <span className="italic text-accent">capa de inteligencia</span> trabajando contigo?
        </h2>

        <ol className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {LAYERS.map(({ icon: Icon, verb, title, body }, i) => (
            <li key={verb} className="reveal bg-surface p-8">
              <div className="flex items-center justify-between">
                <Icon aria-hidden className="size-5 text-accent" strokeWidth={1.6} />
                <span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
              </div>
              <p className="eyebrow mt-10">{verb}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
