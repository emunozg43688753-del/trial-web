# TRIAL

**Superinteligencia para potenciar al humano.**

TRIAL es un Centro de Experiencia de Superinteligencia: una plataforma web donde las empresas descubren, exploran y conversan con inteligencia artificial aplicada a su operación. Su pieza central, **TRIAL Brain**, es un estratega de IA que diagnostica procesos, propone agentes autónomos y planifica implementaciones.

> ¿Qué podrías hacer si tu empresa tuviera una capa de inteligencia trabajando contigo?

---

## 1. Qué incluye

| Ruta | Descripción |
| --- | --- |
| `/` | Experiencia principal: hero con TRIAL Brain, capa de inteligencia, soluciones, selector de automatización, agentes, método y filosofía |
| `/intelligence` | Workspace completo de TRIAL Brain: historial, nuevas conversaciones, prompts recomendados, streaming |
| `/solutions` · `/solutions/[slug]` | Catálogo de 8 soluciones con páginas individuales (SSG) |
| `/agents` · `/agents/[slug]` | Catálogo de 6 agentes en formato "spec sheet" (SSG) |
| `/contact` | Formulario validado (cliente + servidor) con honeypot y rate limiting |
| `/about` · `/privacy` · `/terms` | Compañía y legal |
| `/api/chat` | `GET` health check · `POST` chat con streaming |
| `/api/contact` | Recepción de leads con canales enchufables |

Deep links útiles: `/intelligence?q=<pregunta>` inicia una conversación; `/intelligence?c=<id>` continúa una iniciada en el hero.

## 2. Arquitectura

```
Browser (Client Components mínimos)
   │  fetch POST /api/chat  (text stream)
   ▼
Next.js Route Handler  ── validación (zod) · same-origin · rate limit
   │
   ▼
lib/ai/provider.ts  ── selecciona proveedor según variables de entorno
   ├── providers/openai.ts     (cualquier API compatible con OpenAI)
   ├── providers/anthropic.ts  (Anthropic Messages API)
   └── providers/demo.ts       (Demo Mode, sin API key)
   │
   ▼
LLM Provider  → stream de tokens → Response streaming → UI
```

Principios:

- **Server Components por defecto.** Solo son cliente: navbar, TRIAL Brain, workspace, selector de áreas y formulario.
- **Las API keys nunca llegan al navegador.** Todo el código de IA importa `server-only`.
- **Degradación elegante.** Si el proveedor falla antes del primer token, la respuesta cae a Demo Intelligence en lugar de mostrar un error técnico.
- **Contenido como datos.** Soluciones, agentes, áreas y prompts viven en `data/` — listos para migrar a un CMS o base de datos.
- **Persistencia detrás de una interfaz.** El historial usa `ConversationStore` (hoy navegador). Al añadir autenticación, se implementa la misma interfaz contra Supabase u otra base de datos.

## 3. Tecnologías

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript estricto · Tailwind CSS v4 · Lucide Icons · Zod · next/font (Geist, Geist Mono, Instrument Serif, servidas desde tu dominio) · Vercel.

> Se optó por primitivas propias estilo shadcn (`components/ui`) en lugar del CLI para mantener el bundle mínimo y el sistema de diseño bajo control total.

## 4. Instalación

Requisitos: Node.js 20.9+ y npm.

```bash
git clone <tu-repo> trial
cd trial
npm install
```

## 5. Variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `LLM_API_KEY` | No* | Clave del proveedor. **Sin ella la app funciona en Demo Mode.** |
| `LLM_MODEL` | Recomendada | Modelo a usar (p. ej. el modelo vigente de tu proveedor) |
| `LLM_PROVIDER` | No | `openai` o `anthropic`. Si se omite, se infiere (`sk-ant-…` → anthropic) |
| `LLM_BASE_URL` | No | Endpoint compatible con OpenAI (Groq, OpenRouter, Together, AI Gateway…) |
| `LLM_MAX_TOKENS` | No | Por defecto `1200` |
| `LLM_TEMPERATURE` | No | Por defecto `0.4` |
| `NEXT_PUBLIC_APP_URL` | Recomendada en prod. | URL pública para canonical, sitemap y Open Graph |
| `CONTACT_WEBHOOK_URL` | No | Envía cada lead por POST (Zapier, Make, n8n, CRM) |
| `RESEND_API_KEY` · `CONTACT_TO_EMAIL` · `CONTACT_FROM_EMAIL` | No | Envía cada lead por email vía Resend |

Nunca uses el prefijo `NEXT_PUBLIC_` para secretos.

## 6. Ejecución local

```bash
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm run start
```

Comprobación rápida del endpoint:

```bash
curl http://localhost:3000/api/chat
# {"status":"ok","mode":"demo"}

curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cómo automatizo mis ventas?"}]}'
```

## 7. Configuración del LLM

**Demo Mode** (por defecto): sin `LLM_API_KEY`, TRIAL Brain usa respuestas curadas que siguen el mismo método del system prompt y se transmiten token a token. La UI muestra discretamente *Demo Intelligence*.

**Modo live:**

```bash
# OpenAI
LLM_API_KEY=sk-...
LLM_MODEL=<modelo>

# Anthropic
LLM_API_KEY=sk-ant-...
LLM_MODEL=<modelo>

# Cualquier API compatible con OpenAI
LLM_PROVIDER=openai
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=...
LLM_MODEL=<modelo>
```

El comportamiento del cerebro se define en `lib/ai/system-prompt.ts` (versionado con `SYSTEM_PROMPT_VERSION`): un *AI Transformation Strategist* que comprende el contexto, detecta tareas repetitivas, propone agentes e integraciones, plantea la implementación por fases y nunca inventa datos.

## 8. Deployment en Vercel

1. **Crea un repositorio** en GitHub.
2. **Sube el proyecto:**
   ```bash
   git remote add origin https://github.com/<usuario>/trial.git
   git push -u origin main
   ```
3. **Entra en** [vercel.com](https://vercel.com) e inicia sesión con GitHub.
4. **Importa el repositorio** (*Add New → Project*). Vercel detecta Next.js automáticamente.
5. **Configura las variables de entorno** (*Settings → Environment Variables*):
   ```
   LLM_API_KEY=...
   LLM_MODEL=...
   NEXT_PUBLIC_APP_URL=https://tu-dominio.com
   ```
   Puedes desplegar sin `LLM_API_KEY` para lanzar en Demo Mode.
6. **Deploy.**
7. **Verifica:** `/`, `/intelligence` y `/api/chat` (debe responder `{"status":"ok","mode":"live"}` si configuraste la clave).
8. **Prueba real del AI Brain:** escribe una pregunta en el hero y confirma que la respuesta llega en streaming y que el indicador muestra *Live*.

> Cambiar una variable de entorno requiere un nuevo deploy para que el indicador de modo de las páginas estáticas se actualice (el endpoint la lee en cada request).

### Dominio

Cuando tengas un dominio (p. ej. `trial.ai`, si está disponible — verifícalo antes):

1. Vercel → *Settings → Domains* → añade `tudominio.com` y `www.tudominio.com`.
2. Configura los registros DNS que indique Vercel.
3. Actualiza `NEXT_PUBLIC_APP_URL` y vuelve a desplegar.

### Rate limiting en producción

`lib/utils/rate-limit.ts` incluye un limitador en memoria (20 req/min por IP en chat, 5 por 10 min en contacto). En serverless cada instancia tiene su propia memoria, así que para producción implementa `RateLimitStore` con un backend compartido (Upstash Redis / Vercel KV) y pásalo a `createRateLimiter`. Complementa con Vercel Firewall.

## 9. Cómo cambiar o añadir un proveedor de IA

1. Crea `lib/ai/providers/<proveedor>.ts` que implemente `LLMProvider`:
   ```ts
   export interface LLMProvider {
     readonly id: string;
     readonly mode: "live" | "demo";
     streamChat(params: { system: string; messages: LLMMessage[]; signal?: AbortSignal }): AsyncIterable<string>;
   }
   ```
2. Regístralo en `lib/ai/provider.ts` (tipo `ProviderId`, `DEFAULTS` y el `switch`).
3. Selecciónalo con `LLM_PROVIDER=<proveedor>`.

La UI, el endpoint y el system prompt no cambian.

## 10. Estructura del proyecto

```
app/
  (site)/                 páginas de marketing con footer
    page.tsx              home
    solutions/[slug]/     páginas dinámicas (SSG)
    agents/[slug]/
    contact/ about/ privacy/ terms/
  intelligence/page.tsx   workspace de TRIAL Brain (layout de producto)
  api/chat/route.ts       streaming + validación + rate limit + fallback
  api/contact/route.ts
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
components/
  ui/ navigation/ hero/ intelligence/ solutions/ agents/ sections/ contact/
config/site.ts            metadatos, navegación, URL
data/                     solutions, agents, automation-areas, content
hooks/                    use-chat, use-typewriter, use-stick-to-bottom
lib/
  ai/                     provider, system-prompt, providers/, demo-responses, sse
  chat/storage.ts         ConversationStore
  contact/dispatch.ts     canales de leads (webhook, Resend…)
  validation/schemas.ts   esquemas zod compartidos cliente/servidor
  utils/                  cn, rate-limit
types/index.ts
```

## 11. Sistema de cuentas, demo de 3 días y seguimiento

**Embudo:** visitante → TRIAL Brain (3 mensajes gratis) → registro (`/register`, email o Google) → mensaje de felicitación + **demo de 3 días de Agentes de Ventas** → panel `/app` (activar hasta 3 agentes, probarlos, checklist) → emails día 0/1/2/3 → sesión con ventas (reserva o WhatsApp).

| Pieza | Dónde |
| --- | --- |
| Login / registro (Firebase Auth) | `components/auth/*`, `app/(auth)/*` |
| Inicio del trial (server-side, no manipulable) | `app/api/account/route.ts`, `lib/account/server.ts` |
| Panel y agentes de ventas | `components/dashboard/*`, `data/sales-agents.ts` |
| Señales de compra (prueba de agente, clic en ventas) | `app/api/account/event/route.ts` |
| Emails de seguimiento + cron diario | `lib/email/*`, `app/api/cron/follow-ups/route.ts`, `vercel.json` |
| Baja de emails (enlace firmado) | `app/api/unsubscribe/route.ts` |
| Atribución UTM + eventos `dataLayer` | `lib/growth/client.ts` |

### Configurar Firebase (una sola vez)

1. Crea un proyecto en https://console.firebase.google.com.
2. **Authentication → Sign-in method:** habilita *Correo/contraseña* y *Google*.
3. **Authentication → Settings → Authorized domains:** añade tu dominio de Vercel (y el propio cuando lo tengas).
4. **Firestore Database → Crear base de datos** (modo producción). En *Reglas*, pega el contenido de `firestore.rules`.
5. **Configuración del proyecto → Tus apps → Web (</>):** copia `apiKey`, `authDomain`, `projectId`, `appId` a las variables `NEXT_PUBLIC_FIREBASE_*`.
6. **Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada:** del JSON copia `project_id`, `client_email` y `private_key` a `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (pega la clave completa, con `-----BEGIN PRIVATE KEY-----`).

### Seguimiento por email (Resend)

1. Crea cuenta en https://resend.com, verifica tu dominio y crea una API key → `RESEND_API_KEY`.
2. `EMAIL_FROM="TRIAL <hola@tudominio.com>"` y `CONTACT_TO_EMAIL` (donde recibes los avisos de nuevos registros).
3. `CRON_SECRET`: una cadena aleatoria larga. Vercel la usa para llamar al cron diario y firma los enlaces de baja.

### Destino de ventas

`NEXT_PUBLIC_BOOKING_URL` (Calendly, Cal.com…) y/o `NEXT_PUBLIC_WHATSAPP_NUMBER` (con código de país, ej. `573001234567`). Si no defines ninguno, los botones llevan a `/contact`.

### Convertir un usuario en cliente

En Firestore, en `users/{uid}`, cambia `plan` de `"trial"` a `"customer"`. Su panel se desbloquea al instante y deja de recibir la secuencia de demo.

### Datos útiles para ventas en cada usuario

`attribution` (de dónde vino), `activatedAgents`, `testedAgents`, `intents` (clics en reservar/WhatsApp) y `lastIntentAt`. Prioriza a quien tenga `intents.booking` > 0.

## Accesibilidad y rendimiento

HTML semántico, skip link, `aria-*` en chat y tabs (patrón WAI-ARIA con flechas/Home/End), estados de foco visibles, `prefers-reduced-motion` respetado, formularios con errores asociados. Animaciones de scroll 100 % CSS (`animation-timeline: view()`), fuentes locales con `display: swap`, páginas estáticas/SSG y JavaScript de cliente solo donde hay interacción. Soporta modo claro y oscuro según el sistema.

---

© TRIAL — *Superintelligence for human potential.*
