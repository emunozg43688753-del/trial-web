const PRINCIPLES = [
  {
    k: "I",
    title: "Amplificar, no reemplazar.",
    body: "Diseñamos cada sistema alrededor de una persona: la IA asume lo repetitivo para que el criterio humano llegue más lejos.",
  },
  {
    k: "II",
    title: "Precisión antes que espectáculo.",
    body: "Medimos lo que importa. Un agente que acierta y explica vale más que una demo que impresiona.",
  },
  {
    k: "III",
    title: "Control humano por diseño.",
    body: "Supervisión, trazabilidad y límites claros. La autonomía se gana con evidencia, no con promesas.",
  },
];

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="tone-inverse relative overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="eyebrow reveal mb-10">Filosofía TRIAL</p>
        <h2 id="philosophy-title" className="editorial reveal max-w-5xl text-balance text-5xl text-ink sm:text-7xl lg:text-[6.5rem]">
          AI should amplify humans,{" "}
          <span className="italic text-ink-3">not replace them.</span>
        </h2>

        <div className="reveal mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_1.4fr]">
          <p className="text-lg leading-relaxed text-ink">
            La IA no existe únicamente para automatizar tareas.
            <br />
            Existe para aumentar las capacidades humanas.
          </p>
          <p className="text-[15px] leading-relaxed text-ink-2">
            Cada generación de herramientas extendió lo que una persona puede hacer: la escritura extendió la memoria, el
            cálculo extendió el razonamiento. La inteligencia artificial extiende algo más profundo: la capacidad de
            entender, decidir y actuar a escala. En TRIAL construimos esa extensión con un principio innegociable: el
            humano permanece en el centro.
          </p>
        </div>

        <ol className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {PRINCIPLES.map((p) => (
            <li key={p.k} className="reveal">
              <span className="font-serif text-2xl text-accent italic">{p.k}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
