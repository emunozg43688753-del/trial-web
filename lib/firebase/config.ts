/**
 * Public Firebase web config. These values identify the project and are safe
 * in the browser; access is protected by Firebase Auth and security rules.
 * Each variable must be referenced literally so Next.js can inline it.
 */
export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseClientConfigured = Boolean(
  firebaseClientConfig.apiKey &&
    firebaseClientConfig.authDomain &&
    firebaseClientConfig.projectId &&
    firebaseClientConfig.appId,
);
