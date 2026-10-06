import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firebase Admin (server only). Credentials come from a service account, either
 * the whole JSON in FIREBASE_SERVICE_ACCOUNT (simplest: paste the downloaded file)
 * or split into FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.
 */
interface ServiceAccountJson {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

function serviceAccount(): { projectId?: string; clientEmail?: string; privateKey?: string } {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try {
      const json = JSON.parse(raw) as ServiceAccountJson;
      return { projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key };
    } catch {
      console.error("[firebase] FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    }
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Vercel stores multiline keys with literal "\n"
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}
const usingEmulator = () => Boolean(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_AUTH_EMULATOR_HOST);

export function isFirebaseAdminConfigured(): boolean {
  if (usingEmulator()) return true;
  const sa = serviceAccount();
  return Boolean(sa.projectId && sa.clientEmail && sa.privateKey);
}

function getAdminApp(): App {
  if (getApps().length) return getApp();
  if (usingEmulator()) return initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? "demo-trial" });
  return initializeApp({ credential: cert(serviceAccount()) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
