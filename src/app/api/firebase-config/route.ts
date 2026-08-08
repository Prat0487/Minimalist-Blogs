import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function getFirebaseConfigFromEnv(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId,
  };
}

export async function GET() {
  const config = getFirebaseConfigFromEnv();

  if (!config) {
    return NextResponse.json(
      {
        configured: false,
        config: null,
        checks: {
          apiKey: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
          authDomain: Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
          projectId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
          appId: Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
        },
      },
      { status: 200 }
    );
  }

  const isPlaceholderKey =
    config.apiKey === 'test-api-key' ||
    config.apiKey === 'your-api-key' ||
    config.apiKey.length < 20;

  return NextResponse.json({
    configured: !isPlaceholderKey,
    config: isPlaceholderKey ? null : config,
    checks: {
      apiKey: Boolean(config.apiKey) && !isPlaceholderKey,
      authDomain: true,
      projectId: true,
      appId: true,
    },
    hint: isPlaceholderKey
      ? 'API key is a placeholder. Update NEXT_PUBLIC_FIREBASE_API_KEY in .env.local with your real key from Firebase Console, then restart npm run dev. If you see this on a cloud preview URL, run the app locally at http://localhost:9002 instead.'
      : undefined,
  });
}
