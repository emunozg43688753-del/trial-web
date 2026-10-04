import {
  Target,
  LifeBuoy,
  Telescope,
  Settings2,
  BookOpen,
  Crown,
} from "lucide-react";
import type { Agent } from "@/types";

export const agents: Agent[] = [
  {
    slug: "sales-agent",
    name: "Sales Agent",
    role: "Agente de ventas",
    objective:
      "Convertir cada lead en una conversación relevante, en el momento correcto.",
    tasks: [
      "Califica leads según tu perfil de cliente ideal",
      "Redacta y envía seguimientos personalizados",
      "Actualiza el CRM después de cada interacción",
      "Prepara briefs antes de cada reunión",
    ],
    tools: ["Búsqueda web", "Enriquecimiento de datos", "Email", "Calendario"],
    integrations: ["HubSpot", "Salesforce", "Pipedrive", "Gmail", "Outlook"],
    benefit: "Más reuniones calificadas sin aumentar el equipo comercial.",
    icon: Target,
    sampleInstruction:
      "Revisa los leads de esta semana, prioriza los 10 con mayor intención y prepara un seguimiento para cada uno.",
  },
  {
    slug: "support-agent",
    name: "Support Agent",
    role: "Agente de soporte",
    objective: "Resolver al instante lo frecuente y escalar con contexto lo complejo.",
    tasks: [
      "Responde consultas con la base de conocimiento",
      "Clasifica y prioriza tickets",
      "Escala a humanos con resumen del caso",
      "Detecta patrones de problemas recurrentes",
    ],
    tools: ["Base de conocimiento", "Historial de tickets", "Estado de pedidos"],
    integrations: ["Zendesk", "Intercom", "Freshdesk", "WhatsApp Business"],
    benefit: "Respuesta inmediata y equipos humanos enfocados en casos de alto valor.",
    icon: LifeBuoy,
    sampleInstruction:
      "Atiende los tickets nuevos, resuelve los de nivel 1 y escala el resto con un resumen.",
  },
  {
    slug: "research-agent",
    name: "Research Agent",
    role: "Agente de investigación",
    objective: "Convertir preguntas complejas en análisis estructurados con fuentes.",
    tasks: [
      "Investiga mercados, competidores y tendencias",
      "Sintetiza documentos extensos",
      "Compara alternativas con criterios definidos",
      "Entrega reportes con citas verificables",
    ],
    tools: ["Búsqueda web", "Lectura de PDFs", "Análisis de datos"],
    integrations: ["Google Drive", "Notion", "SharePoint", "Slack"],
    benefit: "Investigación de días reducida a horas, con trazabilidad de fuentes.",
    icon: Telescope,
    sampleInstruction:
      "Analiza a nuestros 5 principales competidores y resume precios, posicionamiento y movimientos recientes.",
  },
  {
    slug: "operations-agent",
    name: "Operations Agent",
    role: "Agente de operaciones",
    objective: "Mantener la operación fluyendo y anticipar problemas antes de que escalen.",
    tasks: [
      "Monitorea indicadores y SLA",
      "Detecta anomalías y genera alertas",
      "Coordina tareas entre equipos",
      "Genera reportes operativos diarios",
    ],
    tools: ["Consultas a bases de datos", "Alertas", "Gestión de tareas"],
    integrations: ["SAP", "Odoo", "Jira", "Asana", "Google Sheets"],
    benefit: "Visibilidad continua y menos incidentes por detección tardía.",
    icon: Settings2,
    sampleInstruction:
      "Revisa los pedidos retrasados de hoy, identifica la causa y notifica a los responsables.",
  },
  {
    slug: "knowledge-agent",
    name: "Knowledge Agent",
    role: "Agente de conocimiento empresarial",
    objective: "Hacer que el conocimiento interno sea accesible, preciso y verificable.",
    tasks: [
      "Responde preguntas sobre políticas y procesos",
      "Cita las fuentes de cada respuesta",
      "Respeta permisos por rol",
      "Identifica vacíos de documentación",
    ],
    tools: ["Búsqueda semántica", "RAG con citas", "Control de acceso"],
    integrations: ["Confluence", "Notion", "Google Drive", "SharePoint"],
    benefit: "Onboarding más rápido y menos interrupciones a expertos.",
    icon: BookOpen,
    sampleInstruction:
      "¿Cuál es el proceso vigente para aprobar un gasto mayor a 5.000 USD? Cita el documento.",
  },
  {
    slug: "executive-agent",
    name: "Executive Agent",
    role: "Asistente estratégico para ejecutivos",
    objective: "Darle a cada líder una capa de inteligencia sobre su negocio.",
    tasks: [
      "Prepara briefings diarios del negocio",
      "Resume reuniones y compromisos",
      "Analiza indicadores y explica variaciones",
      "Prepara borradores de decisiones y comunicaciones",
    ],
    tools: ["Calendario", "Email", "Dashboards", "Documentos"],
    integrations: ["Google Workspace", "Microsoft 365", "Power BI", "Looker"],
    benefit: "Decisiones mejor informadas con menos tiempo dedicado a recopilar información.",
    icon: Crown,
    sampleInstruction:
      "Prepárame el briefing del lunes: ventas, caja, riesgos y las 3 decisiones que necesito tomar.",
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}
