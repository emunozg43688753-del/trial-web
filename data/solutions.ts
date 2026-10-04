import {
  Workflow,
  Bot,
  MessagesSquare,
  TrendingUp,
  Gauge,
  Library,
  Compass,
  Cpu,
} from "lucide-react";
import type { Solution } from "@/types";

export const solutions: Solution[] = [
  {
    slug: "ai-automation",
    name: "AI Automation",
    tagline: "Procesos que se ejecutan solos, con criterio.",
    description:
      "Automatización inteligente de procesos empresariales: flujos que leen, deciden y actúan sobre documentos, correos y sistemas.",
    problem:
      "Equipos atrapados en tareas manuales de copiar, validar y mover información entre sistemas.",
    benefit:
      "Menos trabajo operativo, menos errores y ciclos más cortos, con trazabilidad completa.",
    icon: Workflow,
    capabilities: [
      "Extracción y clasificación de documentos",
      "Orquestación de flujos entre sistemas",
      "Decisiones basadas en reglas y modelos",
      "Escalamiento a humanos cuando hay incertidumbre",
    ],
    useCases: [
      "Procesamiento de facturas y órdenes de compra",
      "Onboarding de clientes y validación KYC",
      "Conciliación de datos entre ERP y CRM",
    ],
    deliverables: [
      "Mapa de procesos y priorización por impacto",
      "Flujos automatizados en producción",
      "Panel de métricas y alertas",
    ],
    cta: "Automatizar un proceso",
  },
  {
    slug: "ai-agents",
    name: "AI Agents",
    tagline: "Especialistas digitales que trabajan contigo.",
    description:
      "Diseño e implementación de agentes autónomos especializados que usan herramientas, memoria y contexto de negocio.",
    problem:
      "El conocimiento experto no escala: depende de pocas personas y de su disponibilidad.",
    benefit:
      "Capacidad experta disponible 24/7, integrada en las herramientas que tu equipo ya usa.",
    icon: Bot,
    capabilities: [
      "Agentes con herramientas y acceso a APIs",
      "Memoria y contexto por cliente o caso",
      "Sistemas multi-agente coordinados",
      "Guardrails, auditoría y control humano",
    ],
    useCases: [
      "Agente comercial que califica y da seguimiento",
      "Agente de investigación de mercado",
      "Copiloto interno para operaciones",
    ],
    deliverables: [
      "Arquitectura del agente y sus herramientas",
      "Agente desplegado e integrado",
      "Evaluaciones de calidad y seguridad",
    ],
    cta: "Diseñar un agente",
  },
  {
    slug: "intelligent-customer-experience",
    name: "Intelligent Customer Experience",
    tagline: "Cada cliente atendido como si fuera el único.",
    description:
      "Sistemas de IA para atención, soporte y experiencia del cliente en todos los canales.",
    problem:
      "Tiempos de respuesta largos, respuestas inconsistentes y equipos de soporte saturados.",
    benefit:
      "Resolución inmediata de consultas frecuentes y agentes humanos enfocados en los casos que importan.",
    icon: MessagesSquare,
    capabilities: [
      "Asistentes conversacionales omnicanal",
      "Clasificación y enrutamiento de tickets",
      "Respuestas sugeridas para agentes humanos",
      "Análisis de sentimiento y calidad",
    ],
    useCases: [
      "Soporte de primer nivel en WhatsApp y web",
      "Triage automático en mesa de ayuda",
      "Detección temprana de clientes en riesgo",
    ],
    deliverables: [
      "Base de conocimiento estructurada",
      "Asistente en producción por canal",
      "Métricas de resolución y satisfacción",
    ],
    cta: "Mejorar mi atención",
  },
  {
    slug: "ai-sales-systems",
    name: "AI Sales Systems",
    tagline: "Un pipeline que nunca se enfría.",
    description:
      "Automatización inteligente de procesos comerciales, desde la prospección hasta la propuesta.",
    problem:
      "Leads que se pierden por falta de seguimiento y vendedores que dedican más tiempo al CRM que a vender.",
    benefit:
      "Seguimiento consistente, priorización objetiva y más tiempo de calidad con clientes.",
    icon: TrendingUp,
    capabilities: [
      "Calificación automática de leads",
      "Seguimiento multicanal personalizado",
      "CRM que se actualiza solo",
      "Generación de propuestas",
    ],
    useCases: [
      "Scoring de leads entrantes",
      "Secuencias de seguimiento personalizadas",
      "Resúmenes de llamadas comerciales",
    ],
    deliverables: [
      "Modelo de calificación de leads",
      "Automatizaciones integradas al CRM",
      "Tablero comercial inteligente",
    ],
    cta: "Escalar mis ventas",
  },
  {
    slug: "ai-operations",
    name: "AI Operations",
    tagline: "Operaciones que anticipan en lugar de reaccionar.",
    description:
      "Optimización de operaciones mediante IA: planificación, monitoreo y detección de anomalías.",
    problem:
      "Decisiones operativas tomadas tarde, con datos dispersos y sin visibilidad end-to-end.",
    benefit:
      "Visibilidad en tiempo real, alertas tempranas y decisiones con fundamento.",
    icon: Gauge,
    capabilities: [
      "Pronóstico de demanda e inventario",
      "Detección de anomalías",
      "Reportes operativos automáticos",
      "Asistentes para supervisores",
    ],
    useCases: [
      "Planificación de inventario",
      "Monitoreo de SLA y cuellos de botella",
      "Reporte diario generado automáticamente",
    ],
    deliverables: [
      "Diagnóstico operativo",
      "Modelos y alertas en producción",
      "Reportes automatizados",
    ],
    cta: "Optimizar operaciones",
  },
  {
    slug: "knowledge-intelligence",
    name: "Knowledge Intelligence",
    tagline: "Todo lo que tu empresa sabe, a una pregunta de distancia.",
    description:
      "Transformación del conocimiento empresarial en sistemas inteligentes consultables con fuentes verificables.",
    problem:
      "Información crítica enterrada en documentos, correos y cabezas de personas clave.",
    benefit:
      "Respuestas precisas con citas, onboarding más rápido y menos dependencia de expertos puntuales.",
    icon: Library,
    capabilities: [
      "Búsqueda semántica sobre documentos",
      "Asistentes con citas a fuentes (RAG)",
      "Permisos por rol y área",
      "Actualización continua del conocimiento",
    ],
    useCases: [
      "Asistente de políticas y procedimientos",
      "Copiloto legal o técnico interno",
      "Onboarding de nuevos colaboradores",
    ],
    deliverables: [
      "Arquitectura de conocimiento",
      "Asistente consultable con citas",
      "Panel de uso y vacíos de información",
    ],
    cta: "Activar mi conocimiento",
  },
  {
    slug: "ai-strategy",
    name: "AI Strategy",
    tagline: "Dónde empezar, qué priorizar y cómo medir.",
    description:
      "Diseño de estrategia de adopción de IA: oportunidades, hoja de ruta, gobierno y capacidades.",
    problem:
      "Pilotos aislados sin impacto real y presión por adoptar IA sin un plan claro.",
    benefit:
      "Una hoja de ruta priorizada por valor, con casos medibles y riesgos controlados.",
    icon: Compass,
    capabilities: [
      "Descubrimiento de oportunidades",
      "Priorización por impacto y factibilidad",
      "Gobierno y uso responsable de IA",
      "Formación de equipos",
    ],
    useCases: [
      "Hoja de ruta de IA a 12 meses",
      "Evaluación de madurez",
      "Selección de proveedores y modelos",
    ],
    deliverables: [
      "Portafolio de casos priorizados",
      "Roadmap y modelo de gobierno",
      "Plan de capacitación",
    ],
    cta: "Diseñar mi estrategia",
  },
  {
    slug: "custom-ai-systems",
    name: "Custom AI Systems",
    tagline: "Cuando lo que necesitas todavía no existe.",
    description:
      "Desarrollo de sistemas de inteligencia artificial a medida, integrados a tu producto o infraestructura.",
    problem:
      "Herramientas genéricas que no entienden tu dominio, tus datos ni tus restricciones.",
    benefit:
      "Un sistema propio, diseñado para tu contexto, con control total sobre datos y evolución.",
    icon: Cpu,
    capabilities: [
      "Integración de LLMs en productos",
      "Pipelines de datos y evaluación",
      "Despliegue en tu nube o on-premise",
      "Observabilidad y mejora continua",
    ],
    useCases: [
      "Funcionalidades de IA dentro de un SaaS",
      "Motores de recomendación",
      "Análisis inteligente de documentos especializados",
    ],
    deliverables: [
      "Arquitectura técnica",
      "Sistema en producción",
      "Documentación y transferencia",
    ],
    cta: "Construir a medida",
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}
