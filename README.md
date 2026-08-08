# Minimalist Blogs

A modern, responsive personal blogging platform built with Next.js, Firebase Authentication, and Google Genkit AI.

## Features

- **Article browsing** — Clean card layout with category filters and full-text search
- **Personalized feed** — Sign in and select interests to get tailored recommendations
- **Saved articles** — Bookmark posts to revisit later
- **Dark mode** — Light, dark, and system theme support
- **Create posts** — Publish new articles with automatic read-time estimation
- **AI summaries** — On-demand article summaries powered by Google Gemini
- **Social sharing** — Share to Twitter, Facebook, LinkedIn, or copy a link
- **Reading progress** — Visual progress bar while reading long articles
- **Related articles** — Discover similar posts based on tags and category

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

See [docs/SETUP.md](docs/SETUP.md) for detailed Firebase and Google AI setup instructions.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server on port 9002 |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start Genkit developer UI |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Google sign-in
│   ├── posts/            # Article detail & create post
│   └── profile/          # User interests
├── components/           # React components
│   ├── blog/             # Blog-specific UI
│   ├── common/           # Shared UI (logo, theme toggle)
│   ├── home/             # Homepage content
│   └── layout/           # Header, footer
├── context/              # React context (auth)
├── lib/                  # Utilities (posts, firebase, bookmarks)
└── ai/                   # Genkit AI flows
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Firebase Auth](https://firebase.google.com/docs/auth) (Google sign-in)
- [Genkit](https://firebase.google.com/docs/genkit) + Google Gemini (AI summaries)

## Documentation

- [Setup Guide](docs/SETUP.md) — Environment variables, Firebase, and Google AI configuration
- [Blueprint](docs/blueprint.md) — Original design guidelines

## Notes

- Authentication and personalization require Firebase configuration. The app works without it for browsing and creating posts.
- User-created posts are persisted in the browser via `localStorage` and merged with the built-in sample articles.
- AI summaries require a Google AI API key and are generated on demand to avoid unnecessary API calls.

## License

Private project.
