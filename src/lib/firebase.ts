import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let initError: Error | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    return null;
  }

  if (initError) {
    return null;
  }

  if (!app) {
    try {
      app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
    } catch (error) {
      initError = error instanceof Error ? error : new Error('Failed to initialize Firebase');
      console.error('Firebase initialization failed:', initError);
      return null;
    }
  }

  return app;
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }

  if (!auth) {
    try {
      auth = getAuth(firebaseApp);
    } catch (error) {
      console.error('Firebase auth initialization failed:', error);
      return null;
    }
  }

  return auth;
}

export const googleProvider = new GoogleAuthProvider();

export default getFirebaseApp;
