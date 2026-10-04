import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-8">
        <div className="grid gap-14 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="editorial mt-6 max-w-xs text-3xl text-ink">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-3">
              Centro de Experiencia de Superinteligencia. Diseñamos sistemas que amplifican el criterio humano.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow mb-5">{group.title}</h2>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TRIAL. Todos los derechos reservados.</p>
          <p className="font-mono tracking-wider">HUMAN × INTELLIGENCE</p>
        </div>
      </div>
    </footer>
  );
}
