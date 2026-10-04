import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Política de privacidad de TRIAL.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      updated="octubre 2026"
      sections={[
        { title: "Datos que recopilamos", body: "Recopilamos los datos que nos proporcionas voluntariamente a través del formulario de contacto (nombre, empresa, email, área y mensaje) y los mensajes que envías a TRIAL Brain." },
        { title: "Uso de la información", body: "Usamos tus datos exclusivamente para responder a tus solicitudes, mejorar nuestros servicios y, si lo autorizas, enviarte información relevante. No vendemos datos personales." },
        { title: "TRIAL Brain", body: "Las conversaciones se procesan para generar respuestas y pueden enviarse a proveedores de modelos de lenguaje bajo acuerdos de tratamiento de datos. El historial se guarda localmente en tu navegador. No compartas información confidencial o sensible." },
        { title: "Conservación", body: "Conservamos tus datos solo durante el tiempo necesario para los fines descritos o mientras exista una relación comercial." },
        { title: "Tus derechos", body: "Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a hola@trial.ai." },
      ]}
    />
  );
}
