# Setup Guide

This guide walks you through configuring Minimalist Blogs for local development.

## 1. Install dependencies

```bash
npm install
```

## 2. Firebase Authentication

Firebase powers Google sign-in, personalized feeds, and saved interests.

### Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (or use an existing one).
3. Add a **Web app** to your project.
4. Copy the Firebase config values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Enable Google sign-in

1. In Firebase Console, go to **Authentication** → **Sign-in method**.
2. Enable **Google** as a sign-in provider.
3. Add `localhost` to authorized domains if prompted.

### Without Firebase

The app still works without Firebase. You can browse articles, search, filter by category, create posts, and use dark mode. Sign-in, interests, and bookmarks require Firebase.

## 3. Google AI (Genkit)

AI summaries use Google Gemini via Genkit.

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Add it to `.env.local`:

```env
GOOGLE_GENAI_API_KEY=your-google-ai-api-key
```

3. Start the Genkit dev server (optional, for debugging flows):

```bash
npm run genkit:dev
```

Summaries are generated on demand when a reader clicks **Generate Summary** on an article page.

## 4. Site URL

Set the public site URL for correct social sharing links:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:9002
```

In production, set this to your deployed domain (e.g. `https://your-app.web.app`).

## 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002).

## Troubleshooting

### Build fails with Firebase auth error

Ensure `.env.local` exists with valid Firebase credentials, or leave Firebase variables empty — the app initializes auth only when credentials are present.

### AI summary fails

- Confirm `GOOGLE_GENAI_API_KEY` is set in `.env.local`.
- Restart the dev server after changing environment variables.
- Check the browser console and terminal for Genkit error messages.

### Posts disappear after restart

Built-in sample posts are bundled with the app. User-created posts are saved to `localStorage` in the browser and persist across page reloads but are per-browser, not synced to a server.

### Google sign-in popup blocked

Allow popups for `localhost` in your browser settings, or try a different browser.

## Production deployment

This project includes an `apphosting.yaml` for Firebase App Hosting. Set all environment variables in your hosting provider's dashboard before deploying.

```bash
npm run build
npm run start
```
