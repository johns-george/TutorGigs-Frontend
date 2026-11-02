# TutorGigs Frontend

[![Frontend CI](https://github.com/johns-george/TutorGigs-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/johns-george/TutorGigs-Frontend/actions/workflows/ci.yml)

React + TypeScript single-page app for **TutorGigs**, a tutoring marketplace where tutors publish gigs and students bid, chat and manage bookings.

- **Live app:** https://final-tutor-app-frontend.onrender.com/
- **Backend repo:** https://github.com/johns-george/TutorGigs-Backend

## Features

- Role-based experiences: separate **student** and **teacher** dashboards with protected routes
- Gig explorer, gig creation/editing, bidding and bid management, wishlist
- **Real-time 1:1 and group chat** (STOMP over SockJS WebSocket), with reconnect and ping handling in a shared `useChatSocket` hook
- Sign-up, login, forgot-password / reset-password and forgot-username flows
- Light/dark theme, loading skeletons and an error boundary

## Tech stack

React 18 · TypeScript · Vite · React Router · Tailwind CSS · shadcn/ui · Axios · STOMP.js + SockJS · Docker + NGINX

## Project structure

```
src/
├── pages/          route-level screens (Explorer, MyGigs, ChatPage, dashboards, auth flows...)
├── components/     shared UI (Navbar, ChatList, ProtectedRoute, ErrorBoundary...)
├── contexts/       AuthContext, ThemeContext
├── hooks/          useChatSocket (STOMP connection, presence ping, reconnect)
├── api.ts          Axios client + API URL resolution
└── tokenUtils.tsx  token handling
```

## Run locally

```bash
cp .env.example .env      # VITE_API_URL=http://localhost:8080
npm ci
npm run dev
```

The app runs at http://localhost:5173. You need the [backend](https://github.com/johns-george/TutorGigs-Backend) running (or point `VITE_API_URL` at the hosted API).

## API URL: build time vs. run time

- **Build time:** Vite would inline `import.meta.env.VITE_API_URL` from an `.env*` file. The Dockerfile deliberately sets no such variable and `.env*` files are not committed (only `.env.example` is tracked), so no environment-specific URL is baked into the image.
- **Run time:** `docker-entrypoint.sh` writes `/usr/share/nginx/html/config.js` from the `VITE_API_URL` environment variable (default `https://final-tutor-app-backend.onrender.com`) and then starts NGINX. `index.html` loads `/config.js` before the app bundle, and `src/api.ts` resolves the base URL as `window.__APP_CONFIG__.API_URL` → `import.meta.env.VITE_API_URL` → `http://localhost:8080`.
- `npm run dev` has no `config.js`, so local development uses `.env` (copied from `.env.example`) or the localhost default.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_URL` | no | Backend base URL. Injected at container start; defaults to localhost:8080 in dev and the Render API in the image |

## Production build with Docker

The image builds the Vite app and serves it from **NGINX** with SPA fallback routing. The API URL is injected at container start, so one image works in any environment:

```bash
docker build -t tutorgigs-frontend .
docker run -p 8080:80 -e VITE_API_URL=https://your-api.example.com tutorgigs-frontend
```

## CI

[GitHub Actions](https://github.com/johns-george/TutorGigs-Frontend/actions/workflows/ci.yml) runs `npm ci`, `npx tsc --noEmit` and `npm run build` on every push and pull request. `npm run lint` is also run but `continue-on-error`, because it does not pass yet.

## Known limitations and next steps

- **No frontend test suite yet** — CI verifies types and the production build, not behaviour. Vitest + React Testing Library, starting with `api.ts` URL resolution and the 401 refresh queue, is the next step.
- **Lint does not pass:** 74 errors, mostly `@typescript-eslint/no-explicit-any` on API response types. This is why the lint step is informational rather than blocking.
- **There is no `/config.js` in development**, so the dev server depends on `.env` or the localhost fallback; a missing backend shows up as network errors rather than a startup failure.
- **Chat requires the backend's WebSocket endpoint**; with the backend running Kafka-less (`CHAT_KAFKA_ENABLED=false`) only clients on the same instance receive live messages.
- **The wishlist stores gigs, not tutors**, and there is no earnings/payout screen — the UI matches what the backend actually implements.
- **Not implemented:** offline chat history beyond what the REST endpoints return, push notifications, and email verification.

## Author

Johns George · [LinkedIn](https://www.linkedin.com/in/johns-george-3568b8233/) · [GitHub](https://github.com/johns-george)
