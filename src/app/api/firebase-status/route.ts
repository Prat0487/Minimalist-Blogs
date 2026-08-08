import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const hasAuthDomain = Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  const hasProjectId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const hasAppId = Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  const configured = hasApiKey && hasAuthDomain && hasProjectId && hasAppId;

  return NextResponse.json({
    configured,
    checks: {
      apiKey: hasApiKey,
      authDomain: hasAuthDomain,
      projectId: hasProjectId,
      appId: hasAppId,
    },
  });
}
