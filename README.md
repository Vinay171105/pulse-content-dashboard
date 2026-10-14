# Pulse — Personalized Content Dashboard

A responsive personalized content dashboard built for the SDE Intern Frontend Development assignment. It combines news, movie recommendations, and mock social posts in one feed, with user preferences, favorites, debounced search, drag-and-drop ordering, dark mode, API routes, and tests.

## Tech stack
- Next.js 14 App Router + React + TypeScript
- Tailwind CSS
- Redux Toolkit for global preferences and content state
- Next.js Route Handlers for server-side API calls
- dnd-kit for accessible drag-and-drop sorting
- Framer Motion for layout animation
- Jest + React Testing Library

## Requirements covered
- **Personalized feed:** select topics in the sidebar or Settings; preferences persist in `localStorage`.
- **Multiple sources:** `/api/news`, `/api/recommendations`, and `/api/social`. NewsAPI and TMDB are optional; deterministic demo data keeps the app usable without keys. Social is intentionally mocked.
- **Content cards:** image, title, description, source, category, external link, favorite button.
- **Pagination:** Load more content button.
- **Responsive dashboard:** sidebar, header search, navigation, cards, mobile menu.
- **Trending and Favorites:** sidebar sections; favorites persist locally.
- **Debounced search:** 350 ms delay before refetching.
- **Drag-and-drop:** reorder cards using dnd-kit.
- **Dark mode:** saved in localStorage.
- **State and async logic:** Redux Toolkit + `createAsyncThunk`.
- **Testing:** reducer unit tests and content-card tests; see test command below.

## Prerequisites
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works in demo mode without API keys. To enable live content, add keys to `.env.local` and restart the server:

```env
NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_v3_api_key
```

Keys are read only in server route handlers and should never be prefixed with `NEXT_PUBLIC_`. NewsAPI's free plan may restrict browser-facing production use; this implementation calls it server-side. Review the provider's current plan and terms before deploying. TMDB attribution/terms may apply when using its API.

## Test and build

```bash
npm test
npm run build
```

## Deploy
1. Push this folder to a public GitHub repository.
2. Import the repository into Vercel.
3. Add `NEWS_API_KEY` and `TMDB_API_KEY` under project environment variables (optional).
4. Deploy and test search, favorites, dark mode, drag reorder, mobile layout, and empty states.

## Project structure

```text
app/
  api/news/route.ts
  api/recommendations/route.ts
  api/social/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ContentCard.tsx
  Dashboard.tsx
lib/demoContent.ts
store/
  contentSlice.ts
  hooks.ts
  preferencesSlice.ts
  Providers.tsx
  store.ts
tests/
  ContentCard.test.tsx
  preferencesSlice.test.ts
```

## Notes / known tradeoffs
- Social posts use a mock endpoint because public social APIs commonly require approval/authentication.
- Demo fallback data makes the experience reviewable before keys are configured. Some categories may show demo content when a live provider has no matching results.
- The Trending view uses a stable demo ordering; a production version should rank by source engagement and freshness.
- Authentication and real-time WebSockets are optional bonus requirements and are not included in this focused 48-hour implementation.
