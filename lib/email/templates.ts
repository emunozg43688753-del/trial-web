import "server-only";
import { growthConfig, salesLink } from "@/config/growth";
import { siteConfig } from "@/config/site";

/**
 * Lifecycle emails for the 3-day demo. Each one has a single, clear call to
 * action — that is what moves a trial user towards a sales conversation.
 */

interface EmailInput {
  name: string;
  trialEndsAt: Date;
  unsubscribeUrl: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const plainFirst = (name: string) => name.trim().split(" ")[0] || "";
const firstName = (name: string) => esc(plainFirst(name));

function absolute(href: string) {
  return href.startsWith("http") ? href : `${siteConfig.url}${href}`;
}

function layout({ preheader, body, cta, secondary, unsubscribeUrl }: {
  preheader: string;
  body: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  unsubscribeUrl: string;
}) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#fafaf8;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0e0e0c">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e5df;border-radius:16px">
<tr><td style="padding:28px 32px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;letter-spacing:4px;font-weight:600">TRIAL</td></tr>
<tr><td style="padding:20px 32px 8px;font-size:15px;line-height:1.65;color:#44443e">${body}</td></tr>
<tr><td style="padding:16px 32px 8px"><a href="${absolute(cta.href)}" style="display:inline-block;background:#0e0e0c;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 22px;border-radius:999px">${esc(cta.label)}</a></td></tr>
${secondary ? `<tr><td style="padding:4px 32px 8px"><a href="${absolute(secondary.href)}" style="color:#3442d9;font-size:14px">${esc(secondary.label)} →</a></td></tr>` : ""}
<tr><td style="padding:24px 32px 28px;font-size:12px;color:#6b6b63;border-top:1px solid #e6e5df">
Superintelligence for human potential. · <a href="${unsubscribeUrl}" style="color:#6b6b63">Dejar de recibir estos correos</a>
</td></tr></table></td></tr></table></body></html>`;
}

const dateFmt = (d: Date) =>
  d.toLocaleString("es", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export function welcomeEmail({ name, trialEndsAt, unsubscribeUrl }: EmailInput) {
  return {
    subject: `🎉 ${plainFirst(name) || "Felicidades"}, ganaste ${growthConfig.trialDays} días de Agentes de Ventas`,
    html: layout({
      preheader: "Tu demo ya está activa. Activa tu primer agente en menos de 5 minutos.",
      body: `<h1 style="font-size:24px;line-height:1.2;color:#0e0e0c;margin:0 0 14px">¡Felicidades${firstName(name) ? `, ${firstName(name)}` : ""}! Ganaste una demo de ${growthConfig.trialDays} días.</h1>
<p>Desde hoy tienes acceso a nuestro <strong>listado de Agentes de Ventas con IA</strong>: califican leads, hacen seguimiento y agendan reuniones por ti.</p>
<p><strong>Tu primer paso (5 minutos):</strong> activa el <em>Lead Qualifier</em> y pruébalo con un caso real de tu negocio.</p>
<p style="color:#6b6b63;font-size:13px">Tu demo está activa hasta el ${esc(dateFmt(trialEndsAt))}.</p>`,
      cta: { label: "Activar mis agentes", href: "/app" },
      unsubscribeUrl,
    }),
  };
}

export function day1Email({ name, unsubscribeUrl }: EmailInput) {
  return {
    subject: "Tu primer agente de ventas en 5 minutos",
    html: layout({
      preheader: "Una guía corta para sacarle valor a tu demo hoy mismo.",
      body: `<p>Hola ${firstName(name) || ""},</p>
<p>Los equipos que más aprovechan la demo hacen esto en el primer día:</p>
<ol style="padding-left:18px"><li><strong>Activan el Lead Qualifier</strong> para priorizar contactos.</li>
<li><strong>Activan el Follow-up Agent</strong> para que ningún lead se enfríe.</li>
<li><strong>Prueban cada agente</strong> con un caso real en TRIAL Intelligence.</li></ol>
<p>Te quedan 2 días de demo.</p>`,
      cta: { label: "Continuar mi demo", href: "/app" },
      unsubscribeUrl,
    }),
  };
}

export function day2Email({ name, trialEndsAt, unsubscribeUrl }: EmailInput) {
  const sales = salesLink("Hola TRIAL, mi demo termina mañana y quiero mantener mis agentes activos.");
  return {
    subject: "⏳ Último día de tu demo de Agentes de Ventas",
    html: layout({
      preheader: "Tu demo termina en menos de 24 horas.",
      body: `<p>Hola ${firstName(name) || ""},</p>
<p>Tu demo termina el <strong>${esc(dateFmt(trialEndsAt))}</strong>.</p>
<p>Si los agentes te mostraron potencial, agenda una sesión estratégica de 30 minutos: revisamos tu proceso comercial y te mostramos cómo dejarlos trabajando con tus herramientas reales.</p>`,
      cta: { label: "Agendar mi sesión", href: sales.href },
      secondary: { label: "Aprovechar mi último día", href: "/app" },
      unsubscribeUrl,
    }),
  };
}

export function day3Email({ name, unsubscribeUrl }: EmailInput) {
  const sales = salesLink("Hola TRIAL, terminó mi demo y quiero activar mis agentes de ventas.");
  return {
    subject: "Tu demo terminó — mantén tus agentes trabajando",
    html: layout({
      preheader: "Tus agentes siguen configurados. Actívalos con un plan.",
      body: `<p>Hola ${firstName(name) || ""},</p>
<p>Tu demo de ${growthConfig.trialDays} días terminó, pero tu configuración sigue guardada.</p>
<p>Habla con un estratega de TRIAL: diseñamos contigo la implementación de tus agentes de ventas y la conectamos a tu CRM, WhatsApp y correo.</p>`,
      cta: { label: "Hablar con un estratega", href: sales.href },
      secondary: { label: "Ver mis agentes", href: "/app" },
      unsubscribeUrl,
    }),
  };
}

export function ownerNewSignupEmail(lead: Record<string, string>) {
  const rows = Object.entries(lead)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b6b63">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("");
  return {
    subject: `Nuevo registro en demo — ${lead.company || lead.email}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px"><h2>Nuevo usuario en demo de ${growthConfig.trialDays} días</h2><table>${rows}</table><p>Contáctalo en las próximas 24 h: es cuando la intención es más alta.</p></div>`,
  };
}
