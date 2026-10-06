import {
  CalendarCheck,
  FileText,
  Filter,
  MessageCircleReply,
  PhoneCall,
  RefreshCcw,
  Search,
  DatabaseZap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SalesAgent {
  id: string;
  name: string;
  tagline: string;
  outcome: string;
  tasks: string[];
  icon: LucideIcon;
  /** demo = activable during the free trial; pro = unlocked with a plan */
  tier: "demo" | "pro";
  /** Prompt sent to TRIAL Brain when the user tests the agent */
  testPrompt: string;
}

export const salesAgents: SalesAgent[] = [
  {
    id: "lead-qualifier",
    name: "Lead Qualifier",
    tagline: "Califica cada lead en segundos.",
    outcome: "Tu equipo solo habla con quien está listo para comprar.",
    tasks: ["Puntúa leads por intención y perfil", "Detecta urgencia y presupuesto", "Prioriza la bandeja comercial"],
    icon: Filter,
    tier: "demo",
    testPrompt: "Actúa como mi agente Lead Qualifier: diseña un sistema de calificación de leads para mi negocio y dime qué datos necesito capturar.",
  },
  {
    id: "follow-up",
    name: "Follow-up Agent",
    tagline: "Ningún lead se queda sin respuesta.",
    outcome: "Seguimiento consistente sin que nadie lo tenga que recordar.",
    tasks: ["Secuencias personalizadas", "Responde objeciones frecuentes", "Reactiva conversaciones frías"],
    icon: MessageCircleReply,
    tier: "demo",
    testPrompt: "Actúa como mi agente de seguimiento: escribe una secuencia de 4 mensajes de seguimiento para un lead que pidió información y no respondió.",
  },
  {
    id: "meeting-setter",
    name: "Meeting Setter",
    tagline: "Convierte interés en reuniones agendadas.",
    outcome: "Más reuniones calificadas en el calendario de tus vendedores.",
    tasks: ["Propone horarios", "Confirma y recuerda citas", "Reduce ausencias"],
    icon: CalendarCheck,
    tier: "demo",
    testPrompt: "Actúa como mi agente Meeting Setter: diseña el flujo para convertir un lead interesado en una reunión agendada, con los mensajes exactos.",
  },
  {
    id: "proposal-writer",
    name: "Proposal Writer",
    tagline: "Propuestas listas en minutos, no en días.",
    outcome: "Ciclos de venta más cortos y propuestas consistentes.",
    tasks: ["Genera borradores con el contexto del cliente", "Adapta precio y alcance", "Resume beneficios clave"],
    icon: FileText,
    tier: "demo",
    testPrompt: "Actúa como mi agente Proposal Writer: crea la estructura de una propuesta comercial persuasiva para mi servicio principal.",
  },
  {
    id: "prospector",
    name: "Prospector",
    tagline: "Encuentra a tus próximos clientes.",
    outcome: "Un pipeline lleno de cuentas que encajan con tu cliente ideal.",
    tasks: ["Investiga cuentas objetivo", "Enriquece contactos", "Redacta el primer mensaje"],
    icon: Search,
    tier: "pro",
    testPrompt: "Actúa como mi agente Prospector: define mi perfil de cliente ideal y cómo encontrar 50 cuentas que encajen.",
  },
  {
    id: "call-analyst",
    name: "Call Analyst",
    tagline: "Aprende de cada conversación comercial.",
    outcome: "Coaching objetivo y menos oportunidades perdidas.",
    tasks: ["Resume llamadas", "Detecta objeciones", "Sugiere próximos pasos"],
    icon: PhoneCall,
    tier: "pro",
    testPrompt: "Actúa como mi agente Call Analyst: ¿qué debería analizar de mis llamadas de venta para cerrar más?",
  },
  {
    id: "reactivation",
    name: "Reactivation Agent",
    tagline: "Recupera clientes y oportunidades dormidas.",
    outcome: "Ingresos de tu base existente, sin inversión en anuncios.",
    tasks: ["Segmenta clientes inactivos", "Crea ofertas de regreso", "Mide respuestas"],
    icon: RefreshCcw,
    tier: "pro",
    testPrompt: "Actúa como mi agente de reactivación: diseña una campaña para recuperar clientes que no compran hace 6 meses.",
  },
  {
    id: "crm-autopilot",
    name: "CRM Autopilot",
    tagline: "Un CRM que se actualiza solo.",
    outcome: "Datos limpios y vendedores enfocados en vender.",
    tasks: ["Registra actividad automáticamente", "Limpia duplicados", "Alerta sobre deals estancados"],
    icon: DatabaseZap,
    tier: "pro",
    testPrompt: "Actúa como mi agente CRM Autopilot: ¿cómo automatizo la actualización de mi CRM después de cada interacción?",
  },
];

export const demoAgentIds = new Set(salesAgents.filter((a) => a.tier === "demo").map((a) => a.id));
