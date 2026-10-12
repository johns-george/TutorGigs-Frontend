# TutorGigs Frontend

React + TypeScript single-page app for **TutorGigs**, a tutoring marketplace where tutors publish gigs and students bid, chat and manage bookings.

- **Live app:** https://final-tutor-app-frontend.onrender.com/
- **Backend repo:** https://github.com/johns-george/TutorGigs-Backend

## Features

- Role-based experiences: separate **student** and **teacher** dashboards with protected routes
- Gig explorer, gig creation/editing, bidding and bid management, wishlist
- **Real-time 1:1 and group chat** (STOMP over SockJS WebSocket)
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
├── api.ts          Axios client (base URL from VITE_API_URL)
└── tokenUtils.tsx  token handling
```

## Run locally

```bash
npm install
echo "VITE_API_URL=http://localhost:8080" > .env.local
npm run dev
```

The app runs at http://localhost:5173. You need the [backend](https://github.com/johns-george/TutorGigs-Backend) running (or point `VITE_API_URL` at the hosted API).

## Production build with Docker

The image builds the Vite app and serves it from **NGINX** with SPA fallback routing. The API URL is injected at container start, so one image works in any environment:

```bash
docker build -t tutorgigs-frontend .
docker run -p 8080:80 -e VITE_API_URL=https://your-api.example.com tutorgigs-frontend
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) installs dependencies and builds the app on every push and pull request.

## Author

Johns George · [LinkedIn](https://www.linkedin.com/in/johns-george-3568b8233/) · [GitHub](https://github.com/johns-george)
