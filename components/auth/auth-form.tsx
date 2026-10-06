"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { track } from "@/lib/growth/client";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "./auth-provider";

type Mode = "login" | "register";

const AREAS = ["Ventas", "Marketing", "Atención al cliente", "Operaciones", "Dirección / Gerencia", "Otro"];

const inputCls =
  "block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-ink/40 focus:shadow-soft focus-visible:outline-none";

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Ese email ya tiene una cuenta. Inicia sesión.",
    "auth/invalid-email": "El email no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/wrong-password": "Email o contraseña incorrectos.",
    "auth/user-not-found": "No encontramos una cuenta con ese email.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
    "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
    "auth/network-request-failed": "Sin conexión. Revisa tu red e inténtalo de nuevo.",
    "custom/name": "Escribe tu nombre.",
  };
  return map[code] ?? "No pudimos completar el acceso. Inténtalo de nuevo.";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/app";
  const { configured, user, loading: authLoading, setPendingProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Already signed in → go straight to the dashboard.
  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  useEffect(() => {
    track(mode === "register" ? "signup_view" : "login_view");
  }, [mode]);

  const withAuth = async (fn: () => Promise<unknown>) => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(friendlyError(code));
      setBusy(false);
    }
  };

  const onGoogle = () =>
    withAuth(async () => {
      const auth = getFirebaseAuth();
      if (!auth) return;
      track("auth_google_click", { mode });
      await signInWithPopup(auth, new GoogleAuthProvider());
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    void withAuth(async () => {
      const auth = getFirebaseAuth();
      if (!auth) return;
      if (mode === "register") {
        const name = String(form.get("name") ?? "").trim();
        if (name.length < 2) throw { code: "custom/name" };
        setPendingProfile({
          name,
          company: String(form.get("company") ?? ""),
          phone: String(form.get("phone") ?? ""),
          area: String(form.get("area") ?? ""),
        });
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name }).catch(() => undefined);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  const onReset = async (email: string) => {
    const auth = getFirebaseAuth();
    if (!auth || !email) {
      setError("Escribe tu email arriba para enviarte el enlace.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Te enviamos un enlace para restablecer tu contraseña.");
      setError(null);
    } catch (e) {
      setError(friendlyError((e as { code?: string }).code ?? ""));
    }
  };

  if (!configured) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="editorial text-3xl text-ink">El acceso estará disponible muy pronto.</p>
        <p className="mt-3 text-[15px] text-ink-2">Mientras tanto, cuéntanos tu caso y te activamos la demo manualmente.</p>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
          Solicitar demo <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const isRegister = mode === "register";

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <Button variant="secondary" size="lg" className="w-full" onClick={onGoogle} disabled={busy}>
        <GoogleIcon /> {isRegister ? "Registrarme con Google" : "Continuar con Google"}
      </Button>

      <div className="my-6 flex items-center gap-3 text-[12px] text-ink-3">
        <span className="h-px flex-1 bg-line" /> o con tu email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-ink">Nombre</label>
            <input id="name" name="name" required minLength={2} autoComplete="name" placeholder="Tu nombre" className={inputCls} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink">Email {isRegister && "de trabajo"}</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@empresa.com" className={inputCls} />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor="password" className="text-[13px] font-medium text-ink">Contraseña</label>
            {!isRegister && (
              <button
                type="button"
                className="text-[12px] text-ink-3 hover:text-ink"
                onClick={() => onReset((document.getElementById("email") as HTMLInputElement | null)?.value.trim() ?? "")}
              >
                ¿La olvidaste?
              </button>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={isRegister ? "Mínimo 6 caracteres" : "••••••••"}
            className={inputCls}
          />
        </div>

        {isRegister && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="mb-1.5 block text-[13px] font-medium text-ink">Empresa</label>
              <input id="company" name="company" autoComplete="organization" placeholder="Nombre de tu empresa" className={inputCls} />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 flex justify-between text-[13px] font-medium text-ink">
                WhatsApp <span className="font-normal text-ink-3">Opcional</span>
              </label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+57 300 000 0000" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="area" className="mb-1.5 block text-[13px] font-medium text-ink">¿Qué quieres potenciar primero?</label>
              <select id="area" name="area" defaultValue="Ventas" className={inputCls}>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && <p role="alert" className="rounded-xl bg-danger/5 px-4 py-3 text-[13.5px] text-danger">{error}</p>}
        {info && <p role="status" className="rounded-xl bg-accent-soft px-4 py-3 text-[13.5px] text-accent">{info}</p>}

        <Button type="submit" size="lg" disabled={busy} className={cn("mt-1 w-full", isRegister && "bg-accent text-accent-ink hover:bg-accent/90")}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {isRegister ? "Activar mi demo gratis de 3 días" : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-3">
        {isRegister ? (
          <>¿Ya tienes cuenta? <Link href={`/login${next !== "/app" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-ink hover:text-accent">Inicia sesión</Link></>
        ) : (
          <>¿Aún no tienes cuenta? <Link href="/register" className="font-medium text-ink hover:text-accent">Activa tu demo gratis</Link></>
        )}
      </p>
      {isRegister && (
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-3">
          Al registrarte aceptas los <Link href="/terms" className="underline">Términos</Link> y la{" "}
          <Link href="/privacy" className="underline">Política de privacidad</Link>, y recibir correos sobre tu demo. Puedes darte de baja cuando quieras.
        </p>
      )}
    </div>
  );
}
