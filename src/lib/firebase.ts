import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let initPromise: Promise<Auth | null> | null = null;

async function fetchFirebaseConfig(): Promise<FirebaseClientConfig | null> {
  try {
    const response = await fetch('/api/firebase-config', { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.configured || !data.config) {
      return null;
    }

    return data.config as FirebaseClientConfig;
  } catch (error) {
    console.error('Failed to load Firebase config:', error);
    return null;
  }
}

export async function initFirebaseAuth(): Promise<Auth | null> {
  if (auth) {
    return auth;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const config = await fetchFirebaseConfig();
    if (!config) {
      return null;
    }

    try {
      app = getApps().length ? getApps()[0]! : initializeApp(config);
      auth = getAuth(app);
      return auth;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return null;
    }
  })();

  return initPromise;
}

export function getFirebaseAuth(): Auth | null {
  return auth ?? null;
}

export const googleProvider = new GoogleAuthProvider();

export default initFirebaseAuth;
