import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu panel de TRIAL y a tus agentes de ventas.",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <section className="relative flex flex-1 items-start justify-center overflow-hidden px-5 pt-32 pb-20 sm:pt-40">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70" />
      <div className="relative w-full max-w-md">
        <h1 className="editorial text-center text-5xl text-ink animate-fade-up">Bienvenido de vuelta.</h1>
        <p className="mt-3 mb-8 text-center text-[15px] text-ink-2">Tus agentes te están esperando.</p>
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </section>
  );
}
