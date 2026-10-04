import type { ProcessStep, PromptSuggestion } from "@/types";

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    headline: "Descubrimos oportunidades.",
    description:
      "Mapeamos procesos, datos y fricciones para encontrar dónde la IA genera valor medible.",
    outputs: ["Mapa de procesos", "Casos priorizados"],
  },
  {
    index: "02",
    title: "Design",
    headline: "Diseñamos la solución inteligente.",
    description:
      "Definimos agentes, flujos, integraciones y guardrails antes de escribir una línea de código.",
    outputs: ["Arquitectura", "Criterios de éxito"],
  },
  {
    index: "03",
    title: "Build",
    headline: "Construimos agentes y automatizaciones.",
    description:
      "Iteraciones cortas con evaluaciones de calidad, seguridad y costo en cada entrega.",
    outputs: ["Agentes en producción", "Evaluaciones"],
  },
  {
    index: "04",
    title: "Integrate",
    headline: "Conectamos la IA con tu ecosistema.",
    description:
      "CRM, ERP, comunicaciones y datos: la inteligencia vive donde tu equipo ya trabaja.",
    outputs: ["Integraciones", "Permisos y auditoría"],
  },
  {
    index: "05",
    title: "Optimize",
    headline: "Medimos y mejoramos continuamente.",
    description:
      "Observabilidad, métricas de negocio y mejora continua sobre datos reales de uso.",
    outputs: ["Métricas", "Mejora continua"],
  },
];

export const heroSuggestions: PromptSuggestion[] = [
  { label: "¿Qué procesos puedo automatizar?", prompt: "¿Qué procesos de mi empresa puedo automatizar con IA?" },
  { label: "Diseña un agente para atención al cliente", prompt: "Diseña un agente de IA para atención al cliente." },
  { label: "¿Cómo automatizo mis ventas?", prompt: "¿Cómo puedo automatizar mi proceso de ventas con IA?" },
  { label: "Analiza mi proceso de trabajo", prompt: "Quiero que analices mi proceso de trabajo y detectes oportunidades de IA." },
  { label: "¿Cómo implemento IA en mi empresa?", prompt: "¿Cómo puedo empezar a implementar IA en mi empresa de forma ordenada?" },
];

export const recommendedPrompts: { category: string; prompts: PromptSuggestion[] }[] = [
  {
    category: "Estrategia",
    prompts: [
      { label: "Hoja de ruta de IA a 90 días", prompt: "Ayúdame a diseñar una hoja de ruta de adopción de IA a 90 días para mi empresa." },
      { label: "Priorizar casos de uso", prompt: "Tengo varias ideas de IA. ¿Cómo las priorizo por impacto y factibilidad?" },
    ],
  },
  {
    category: "Agentes",
    prompts: [
      { label: "Agente de ventas", prompt: "Diseña un agente de ventas que califique leads y haga seguimiento." },
      { label: "Agente de conocimiento", prompt: "Quiero un agente que responda preguntas sobre nuestros documentos internos." },
    ],
  },
  {
    category: "Procesos",
    prompts: [
      { label: "Facturas y finanzas", prompt: "¿Cómo automatizo el procesamiento de facturas y la conciliación?" },
      { label: "Operaciones y logística", prompt: "¿Qué puede hacer la IA por mis operaciones y mi logística?" },
    ],
  },
];
