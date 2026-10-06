import "server-only";
import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import { growthConfig } from "@/config/growth";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Account, AccountStatus, Attribution, SignupProfile } from "./types";

export const USERS = "users";
const DAY_MS = 86_400_000;

export class AuthError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

/** Verifies the Firebase ID token sent as `Authorization: Bearer <token>`. */
export async function requireUser(request: Request) {
  if (!isFirebaseAdminConfigured()) throw new AuthError(503, "Auth no configurado");
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new AuthError(401, "No autenticado");
  try {
    return await adminAuth().verifyIdToken(token);
  } catch {
    throw new AuthError(401, "Sesión inválida");
  }
}

export function statusOf(data: DocumentData, now = Date.now()): AccountStatus {
  if (data.plan === "customer") return "customer";
  const ends = (data.trialEndsAt as Timestamp | undefined)?.toMillis() ?? 0;
  return now < ends ? "trial" : "expired";
}

export function serializeAccount(uid: string, data: DocumentData): Account {
  return {
    uid,
    email: data.email ?? "",
    name: data.name ?? "",
    company: data.company ?? "",
    phone: data.phone ?? "",
    area: data.area ?? "",
    status: statusOf(data),
    createdAt: (data.createdAt as Timestamp | undefined)?.toDate().toISOString() ?? new Date().toISOString(),
    trialEndsAt: (data.trialEndsAt as Timestamp | undefined)?.toDate().toISOString() ?? new Date().toISOString(),
    activatedAgents: Array.isArray(data.activatedAgents) ? data.activatedAgents : [],
    testedAgents: Array.isArray(data.testedAgents) ? data.testedAgents : [],
    bookedCall: Boolean(data.intents?.booking),
  };
}

const clean = (v: unknown, max = 160) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Idempotent: creates the account (and starts the trial) only the first time.
 * Trial dates are always set server-side so they can't be tampered with.
 */
export async function getOrCreateAccount(
  user: { uid: string; email?: string; name?: string; firebase?: { sign_in_provider?: string } },
  profile: SignupProfile = {},
  attribution: Attribution = {},
): Promise<{ account: Account; created: boolean; raw: DocumentData }> {
  const ref = adminDb().collection(USERS).doc(user.uid);

  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) {
      tx.update(ref, { lastSeenAt: FieldValue.serverTimestamp() });
      const data = snap.data()!;
      return { account: serializeAccount(user.uid, data), created: false, raw: data };
    }

    const now = Date.now();
    const data = {
      uid: user.uid,
      email: user.email ?? "",
      name: clean(profile.name) || clean(user.name),
      company: clean(profile.company),
      phone: clean(profile.phone, 40),
      area: clean(profile.area, 60),
      provider: user.firebase?.sign_in_provider ?? "password",
      plan: "trial",
      createdAt: Timestamp.fromMillis(now),
      trialEndsAt: Timestamp.fromMillis(now + growthConfig.trialDays * DAY_MS),
      activatedAgents: [] as string[],
      testedAgents: [] as string[],
      attribution: Object.fromEntries(Object.entries(attribution).map(([k, v]) => [k, clean(v, 300)])),
      emailsSent: {},
      intents: {},
      marketingOptOut: false,
      lastSeenAt: Timestamp.fromMillis(now),
    };
    tx.set(ref, data);
    return { account: serializeAccount(user.uid, data), created: true, raw: data };
  });
}

export function jsonError(error: unknown) {
  if (error instanceof AuthError) return Response.json({ error: error.message }, { status: error.status });
  console.error("[account]", error);
  return Response.json({ error: "Error interno" }, { status: 500 });
}
