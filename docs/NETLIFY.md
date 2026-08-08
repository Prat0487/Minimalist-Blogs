# Deploy to Netlify

## One-time setup

1. Push the `master` branch to GitHub.
2. Log in to [Netlify](https://app.netlify.com/) and click **Add new site → Import an existing project**.
3. Connect your GitHub account and select the **Minimalist-Blogs** repository.
4. Netlify should auto-detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Plugin:** `@netlify/plugin-nextjs`
   - **Node version:** 20

## Environment variables

In **Site settings → Environment variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `minimalist-blogs.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `minimalist-blogs` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `minimalist-blogs.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `404109454081` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase Console |
| `NEXT_PUBLIC_SITE_URL` | Your Netlify URL, e.g. `https://your-site.netlify.app` |

`GOOGLE_GENAI_API_KEY` is optional (AI summaries only).

## Firebase authorized domains

In **Firebase Console → Authentication → Settings → Authorized domains**, add:

- `your-site.netlify.app`
- Any custom domain you attach later

## Deploy

After connecting the repo, Netlify deploys automatically on every push to `master`.

Manual deploy from CLI:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Verify

- `https://your-site.netlify.app/api/health` → `{"status":"ok"}`
- `https://your-site.netlify.app/api/firebase-config` → `"configured": true`
- Sign in with Google on `/auth`
