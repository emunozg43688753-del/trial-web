"use client";

import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CONTACT_AREAS, contactSchema } from "@/lib/validation/schemas";

type FieldErrors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "block w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-ink/40 focus:shadow-soft focus-visible:outline-none";

function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[13px] font-medium text-ink">
        {label}
        {optional && <span className="text-[12px] font-normal text-ink-3">Opcional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const a11y = (name: string) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: cn(inputBase, errors[name] ? "border-danger" : "border-line-strong"),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: FieldErrors };
      if (!res.ok) {
        setErrors(body.fieldErrors ?? {});
        setFormError(body.error ?? "No pudimos enviar tu mensaje. Inténtalo de nuevo.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setFormError("No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-start rounded-2xl border border-line bg-surface p-8 animate-fade-up sm:p-10">
        <CheckCircle2 className="size-8 text-success" strokeWidth={1.5} />
        <h2 className="editorial mt-6 text-4xl text-ink">Recibimos tu mensaje.</h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">
          Un estratega de TRIAL revisará tu caso y te contactará en un plazo de 1 a 2 días hábiles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Nombre" error={errors.name}>
          <input {...a11y("name")} autoComplete="name" required placeholder="Tu nombre" />
        </Field>
        <Field id="company" label="Empresa" error={errors.company}>
          <input {...a11y("company")} autoComplete="organization" required placeholder="Nombre de la empresa" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input {...a11y("email")} type="email" autoComplete="email" required placeholder="tu@empresa.com" />
        </Field>
        <Field id="area" label="Área" error={errors.area}>
          <select {...a11y("area")} required defaultValue="">
            <option value="" disabled>
              Selecciona un área
            </option>
            {CONTACT_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="problem" label="Problema" error={errors.problem} hint="En una o dos frases: ¿qué quieres resolver?">
            <input {...a11y("problem")} required placeholder="Ej. Nuestro equipo de soporte no da abasto con el volumen de tickets" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="message" label="Mensaje" error={errors.message} optional>
            <textarea {...a11y("message")} rows={5} placeholder="Contexto adicional: sistemas que usan, volumen, objetivos…" />
          </Field>
        </div>
        {/* Honeypot — hidden from users and assistive tech */}
        <div aria-hidden className="absolute left-[-9999px]">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-[13.5px] text-danger">
          {formError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] text-ink-3">Usamos tus datos solo para responder a tu solicitud.</p>
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Enviando
            </>
          ) : (
            <>
              Enviar solicitud <ArrowUpRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
