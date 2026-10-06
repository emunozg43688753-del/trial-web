/**
 * Curated responses used in Demo Mode (no LLM_API_KEY).
 * They follow the same method as the system prompt so the experience
 * is representative of the live product.
 */

interface DemoIntent {
  id: string;
  keywords: string[];
  response: string;
}

const intents: DemoIntent[] = [
  {
    id: "sales",
    keywords: ["venta", "ventas", "lead", "leads", "comercial", "crm", "prospect", "pipeline", "vendedor"],
    response: `### Diagnóstico inicial: proceso comercial

En la mayoría de equipos comerciales, el cuello de botella no es la falta de leads sino **lo que pasa entre el primer contacto y la reunión**.

**Tareas repetitivas que suelen consumir más tiempo**
- Revisar y priorizar leads entrantes manualmente
- Escribir seguimientos uno por uno
- Actualizar el CRM después de cada llamada o correo
- Preparar propuestas desde cero

### Oportunidades de IA
1. **Calificación automática** — un modelo puntúa cada lead según tu perfil de cliente ideal y su comportamiento.
2. **Seguimiento inteligente** — secuencias personalizadas que se adaptan a las respuestas.
3. **CRM que se actualiza solo** — resúmenes de llamadas y correos registrados automáticamente.
4. **Propuestas en borrador** — generadas con el contexto del cliente para que el vendedor solo revise.

### Agente recomendado: Sales Agent
- **Objetivo:** convertir leads en reuniones calificadas.
- **Herramientas:** enriquecimiento de datos, email, calendario, CRM.
- **Integraciones típicas:** HubSpot, Salesforce o Pipedrive + Gmail/Outlook.
- **Control humano:** el vendedor aprueba los mensajes sensibles y conduce la negociación.

### Implementación sugerida
- **Fase 1 (2–4 semanas):** calificación + resúmenes automáticos en el CRM.
- **Fase 2:** seguimientos automatizados con aprobación.
- **Fase 3:** agente comercial autónomo para leads de menor ticket.

**Métricas a medir:** tiempo de primera respuesta, tasa de lead→reunión y horas comerciales liberadas por semana.

Para afinar la propuesta: **¿qué CRM usan, cuántos leads reciben al mes y cuál es su ciclo de venta promedio?**

¿Quieres verlo funcionando? Prueba gratis durante 3 días nuestros Agentes de Ventas creando tu cuenta en [/register](/register).`,
  },
  {
    id: "support",
    keywords: ["atención", "atencion", "soporte", "cliente", "clientes", "ticket", "whatsapp", "servicio", "call center", "customer"],
    response: `### Agente de atención al cliente: diseño propuesto

**Objetivo:** resolver de inmediato las consultas frecuentes y escalar los casos complejos con todo el contexto, para que tu equipo humano se concentre donde aporta más.

### Arquitectura del agente
1. **Canales de entrada** — web, WhatsApp Business y email conectados a un único cerebro.
2. **Base de conocimiento** — políticas, FAQs, catálogos y procedimientos indexados con búsqueda semántica (RAG), respondiendo **con fuentes**.
3. **Herramientas** — consulta de estado de pedidos, creación de tickets, agenda de citas.
4. **Clasificador** — detecta intención, urgencia y sentimiento en cada mensaje.
5. **Escalamiento humano** — si la confianza es baja o el cliente lo pide, transfiere con un resumen del caso.

### Qué se automatiza y qué no
- **Automático:** preguntas frecuentes, estado de pedidos, cambios simples, triage de tickets.
- **Asistido:** respuestas sugeridas para agentes humanos en casos intermedios.
- **Humano:** reclamos sensibles, negociación, excepciones.

### Integraciones típicas
Zendesk, Intercom o Freshdesk · WhatsApp Business API · tu ERP o e-commerce para pedidos.

### Implementación
- **Piloto:** un canal y las 20 consultas más frecuentes.
- **Expansión:** más canales y herramientas transaccionales.
- **Mejora continua:** revisión semanal de conversaciones no resueltas.

**Métricas a medir:** tasa de resolución automática, tiempo de primera respuesta y satisfacción (CSAT).

**¿Qué canal concentra hoy más volumen y cuántas conversaciones reciben al mes?**`,
  },
  {
    id: "processes",
    keywords: ["proceso", "procesos", "automatizar", "automatización", "automatizacion", "tarea", "tareas", "manual", "repetitiv", "flujo", "analiza"],
    response: `### Cómo detectar qué automatizar

Un buen candidato para IA cumple al menos tres de estas condiciones:
- **Alto volumen** y frecuencia (diaria o semanal).
- **Reglas reconocibles**, aunque tengan excepciones.
- **Información no estructurada** de por medio: correos, PDFs, mensajes.
- **Costo visible** de errores o demoras.

### Procesos que suelen tener mayor retorno
1. **Entrada de documentos** — facturas, órdenes, contratos: extracción y validación automática.
2. **Bandejas de entrada compartidas** — clasificación y respuesta en borrador.
3. **Reportes recurrentes** — generados y enviados automáticamente.
4. **Seguimientos** — a clientes, proveedores o equipos internos.
5. **Consultas internas** — un asistente que responde sobre políticas y procedimientos.

### Método TRIAL en 3 pasos
- **Inventario:** lista las tareas que tu equipo repite cada semana y cuánto tiempo toman.
- **Priorización:** impacto (horas, errores, ingresos) × factibilidad (datos disponibles, integraciones).
- **Piloto:** un proceso, un equipo, métricas claras en pocas semanas.

### Siempre con criterio humano
La IA ejecuta lo repetitivo; las personas supervisan, deciden excepciones y mejoran el sistema.

Para darte un diagnóstico concreto, cuéntame: **¿a qué se dedica tu empresa, qué área quieres optimizar primero y qué tarea consume más horas a tu equipo?**`,
  },
  {
    id: "strategy",
    keywords: ["implementar", "empezar", "estrategia", "empresa", "roadmap", "hoja de ruta", "adopción", "adopcion", "priorizar", "90 días", "comenzar"],
    response: `### Implementar IA de forma ordenada

El error más común es empezar por la herramienta. El orden correcto es **problema → proceso → datos → solución**.

### Hoja de ruta en 4 etapas
**1. Descubrimiento (2–3 semanas)**
- Entrevistas con áreas clave y mapeo de procesos.
- Inventario de datos y sistemas disponibles.
- Lista larga de oportunidades.

**2. Priorización**
- Matriz impacto × factibilidad.
- Selección de 1–2 casos piloto con métricas claras.

**3. Piloto (4–8 semanas)**
- Construcción iterativa con usuarios reales.
- Evaluación de calidad, seguridad y costo.

**4. Escalamiento**
- Integración con sistemas productivos.
- Gobierno de IA: permisos, auditoría, uso responsable.
- Formación de equipos para que adopten y mejoren las herramientas.

### Fundamentos que no se negocian
- **Datos:** acceso, calidad y privacidad.
- **Seguridad:** claves y datos sensibles fuera de herramientas no aprobadas.
- **Personas:** cada solución tiene un responsable humano.

**Para personalizar la hoja de ruta: ¿cuál es tu industria, el tamaño aproximado del equipo y qué área sientes hoy más saturada?**`,
  },
  {
    id: "knowledge",
    keywords: ["conocimiento", "documento", "documentos", "rag", "manual", "políticas", "politicas", "base de conocimiento", "interno", "notion", "drive"],
    response: `### Knowledge Agent: tu conocimiento, consultable

**Problema típico:** la información existe, pero está dispersa en documentos, correos y en la cabeza de pocas personas.

### Cómo funciona
1. **Ingesta** — conectamos fuentes como Google Drive, SharePoint, Notion o Confluence.
2. **Indexación semántica** — los documentos se dividen y representan por significado.
3. **Recuperación + generación (RAG)** — el agente responde usando solo fragmentos relevantes.
4. **Citas** — cada respuesta muestra de qué documento proviene.
5. **Permisos** — cada persona solo accede a lo que su rol permite.

### Casos de uso
- Políticas internas, RR. HH. y procedimientos.
- Soporte técnico interno.
- Onboarding de nuevos colaboradores.

### Buenas prácticas
- Empezar con un dominio acotado y documentos vigentes.
- Definir un responsable de mantener el contenido.
- Medir preguntas sin respuesta para detectar vacíos de documentación.

**¿Dónde vive hoy tu documentación y quiénes serían los primeros usuarios del agente?**`,
  },
  {
    id: "finance",
    keywords: ["factura", "facturas", "finanza", "finanzas", "contab", "conciliación", "conciliacion", "cobranza", "pagos"],
    response: `### Finanzas aumentadas con IA

**Tareas repetitivas habituales:** captura de facturas, validación contra órdenes de compra, conciliación bancaria y recordatorios de cobranza.

### Oportunidades
1. **Procesamiento de facturas** — extracción de proveedor, montos, impuestos y conceptos desde PDF o email.
2. **Validación automática** — cruce con órdenes de compra y alertas por diferencias.
3. **Conciliación** — emparejamiento de movimientos bancarios con registros contables.
4. **Cobranza inteligente** — recordatorios con tono adaptado al historial de cada cliente.
5. **Análisis de variaciones** — explicaciones en lenguaje natural del cierre mensual.

### Control humano
Toda escritura contable pasa por **aprobación**; la IA prepara, la persona decide.

### Integraciones típicas
QuickBooks, Xero, SAP, Odoo o NetSuite · correo de cuentas por pagar · banco (exportaciones o API).

**Métricas a medir:** días de cierre, facturas procesadas por persona y errores detectados antes del registro.

**¿Qué sistema contable usan y cuántas facturas procesan al mes?**`,
  },
  {
    id: "operations",
    keywords: ["operaci", "logística", "logistica", "inventario", "envío", "envios", "envíos", "supply", "producción", "produccion", "almacén"],
    response: `### Operaciones con una capa de inteligencia

### Dónde suele estar la fricción
- Información operativa dispersa en hojas de cálculo y sistemas aislados.
- Problemas detectados cuando ya impactaron al cliente.
- Supervisores dedicando horas a reportes en lugar de a decidir.

### Oportunidades de IA
1. **Detección de anomalías** — alertas tempranas sobre retrasos, quiebres de stock o desvíos.
2. **Pronóstico de demanda** — inventario dimensionado con datos históricos y estacionalidad.
3. **Reporte diario automático** — redactado y enviado cada mañana.
4. **Operations Agent** — investiga la causa de un problema y notifica a los responsables.
5. **Comunicación proactiva** — avisos automáticos a clientes ante retrasos.

### Implementación
- **Piloto:** reporte automático + alertas sobre un indicador crítico.
- **Expansión:** agente que investiga y coordina acciones.

**¿Qué indicador operativo, si mejorara, tendría más impacto en tu negocio?**`,
  },
];

const fallback = `### Empecemos por entender tu contexto

Puedo ayudarte a identificar oportunidades de IA, diseñar agentes y proponer una implementación por fases. Para que la respuesta sea útil y no genérica, necesito tres datos:

1. **¿A qué se dedica tu empresa** y aproximadamente cuántas personas la integran?
2. **¿Qué área o proceso** quieres mejorar primero?
3. **¿Qué tarea consume hoy más tiempo** o genera más errores?

### Mientras tanto, una referencia rápida
- **Ventas:** calificación de leads y seguimiento automático.
- **Atención al cliente:** asistente omnicanal con escalamiento humano.
- **Operaciones:** reportes automáticos y detección de anomalías.
- **Conocimiento:** un asistente interno que responde con fuentes.

Cuéntame tu caso y diseñamos la primera versión juntos.`;

function normalize(text: string): string {
  return text.toLowerCase();
}

export function pickDemoResponse(lastUserMessage: string): string {
  const text = normalize(lastUserMessage);
  let best: { intent: DemoIntent; score: number } | null = null;

  for (const intent of intents) {
    const score = intent.keywords.reduce(
      (acc, kw) => (text.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  return best?.intent.response ?? fallback;
}
