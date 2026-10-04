const fallbackUrl = "http://localhost:3000";

function resolveAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // Vercel provides the production hostname automatically.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return fallbackUrl;
}

export const siteConfig = {
  name: "TRIAL",
  title: "TRIAL — Superinteligencia para potenciar al humano",
  description:
    "Centro de Experiencia de Superinteligencia. Diseñamos agentes autónomos y sistemas de IA que amplifican lo que tu equipo ya sabe hacer.",
  tagline: "Superintelligence for human potential.",
  url: resolveAppUrl(),
  locale: "es_ES",
  keywords: [
    "inteligencia artificial",
    "agentes de IA",
    "automatización empresarial",
    "AI agents",
    "superinteligencia",
    "consultoría de IA",
    "LLM",
  ],
  contactEmail: "hola@trial.ai",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Intelligence", href: "/intelligence" },
  { label: "Solutions", href: "/solutions" },
  { label: "AI Agents", href: "/agents" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Plataforma",
    items: [
      { label: "Intelligence", href: "/intelligence" },
      { label: "Solutions", href: "/solutions" },
      { label: "AI Agents", href: "/agents" },
    ],
  },
  {
    title: "Compañía",
    items: [
      { label: "About", href: "/about" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
