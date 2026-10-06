"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { firebaseClientConfig, isFirebaseClientConfigured } from "./config";

let app: FirebaseApp | null = null;
let emulatorConnected = false;

/** Lazily initialised Firebase Auth. Returns null when Firebase is not configured. */
export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseClientConfigured || typeof window === "undefined") return null;
  app ??= getApps().length ? getApp() : initializeApp(firebaseClientConfig as Required<typeof firebaseClientConfig>);
  const auth = getAuth(app);
  // Local development against the Firebase Auth emulator.
  const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
  if (emulator && !emulatorConnected) {
    connectAuthEmulator(auth, `http://${emulator}`, { disableWarnings: true });
    emulatorConnected = true;
  }
  return auth;
}
