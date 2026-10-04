import { PageHero } from "@/components/ui/section";

interface LegalSection {
  title: string;
  body: string;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Última actualización: ${updated}`} />
      <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <p className="mb-12 rounded-xl border border-line bg-surface-2 p-4 text-[13px] leading-relaxed text-ink-3">
          Documento base. Debe ser revisado por asesoría legal antes de su publicación definitiva.
        </p>
        {sections.map((s, i) => (
          <section key={s.title} className="border-t border-line py-8">
            <h2 className="flex gap-4 text-lg font-semibold tracking-tight text-ink">
              <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <p className="mt-3 pl-9 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}
