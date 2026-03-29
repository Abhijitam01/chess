# Chess monorepo

Real-time multiplayer chess: accounts, rated games, clocks, spectating, and leaderboards. The repo is a pnpm workspace orchestrated with Turborepo.

## Features

### Accounts and session

- Sign up and sign in over HTTP (`/auth/signup`, `/auth/signin`) with bcrypt-hashed passwords and JWT sessions (7-day expiry).
- Client stores session in `localStorage` and sends the token on WebSocket connections.
- Password rules: minimum length, uppercase, digit, and special character (`!@#$%^&*`); username alphanumeric + underscore, 3–20 characters.

### Playing

- Matchmaking queue pairs two authenticated players into a live game.
- Moves validated on the server with the shared chess.js-based engine; invalid moves are rejected.
- Clocks: 5 minutes per side by default; server pushes `TIME_UPDATE` messages.
- Resign and draw (offer, accept, decline).
- Game over (checkmate, resignation, draw, time) with UI feedback.
- Elo-style rating updates after each game (K-factor 32).
- Reconnect: same user can open a new socket; the server reattaches the socket and sends current FEN and clocks.

### Spectating

- `/spectate` lists active games (polls the server every few seconds).
- `/spectate/[id]` hydrates from HTTP move history, then follows live moves over WebSocket with a `spectate` query parameter.
- Spectators must be logged in (same JWT requirement as players).

### Meta

- `/leaderboard`: players sorted by rating with W/L/D and optional limit query.
- `/profile/[username]`: public stats and recent finished games with rating deltas.

### Web app UX

- Landing page with motion-driven intro (Framer Motion).
- Board themes (classic, walnut, ocean, midnight, emerald), coordinate labels toggle, optional move sounds via Web Audio (move, capture, check, start, game over).
- Move history, clocks, sidebar navigation, match-start animation, game-over modal.

### Server and data

- Single Node process serves HTTP and WebSocket on the same port (default `8080`).
- PostgreSQL via Prisma: profiles, credentials, games, game moves (nullable player IDs for edge cases).
- Redis: active game registry, live FEN/clocks/turn, move lists for spectators, pub/sub for broadcasting moves to watchers.
- `GET /health` for liveness checks.

## Architecture

### Apps

| App | Stack | Role |
|-----|--------|------|
| **`apps/web`** | Next.js (App Router), React 19, Tailwind CSS 4 | UI, routing, auth context, game and spectate clients |
| **`apps/ws-server`** | Node 20, `ws`, `ioredis`, Prisma client | HTTP API + WebSocket gameplay and spectate |

There is no separate REST “API” app; HTTP endpoints live on **`apps/ws-server`** alongside WebSockets.

### Packages

| Package | Role |
|---------|------|
| **`packages/chess-engine`** | Shared chess logic wrapping **chess.js** |
| **`packages/types`** (`@repo/types`) | Shared WebSocket message types and payloads |
| **`packages/db`** (`@repo/db`) | Prisma schema, migrations, generated client |
| **`packages/ui`** (`@repo/ui`) | Shared UI primitives and themes |
| **`packages/utils`** | Small shared utilities |
| **`packages/eslint-config`**, **`packages/typescript-config`** | Workspace tooling |

### Protocol

- **WebSocket URL**: `ws://<host>:<port>?token=<jwt>` for play; add `&spectate=<gameId>` to watch.
- Message type constants and shapes live in **`packages/types/src/messages.ts`**.

### HTTP API (ws-server)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/signup`, `/auth/signin` | Create account or sign in |
| `GET` | `/leaderboard?limit=` | Leaderboard (max 100) |
| `GET` | `/profile/:username` | Profile + recent games |
| `GET` | `/games/active` | Active games for spectate list |
| `GET` | `/games/:id/moves` | Move history + current FEN for spectate hydrate |

`OPTIONS` is supported for CORS preflight (currently permissive `*` — tighten for production).

## Prerequisites

- **Node.js** 20+
- **pnpm** 8+
- **PostgreSQL** (local or hosted)
- **Redis** (local or hosted; default `redis://localhost:6379`)

## Environment variables

### `apps/ws-server`

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma |
| `DIRECT_URL` | Yes* | Direct DB URL (e.g. for migrations); often same as `DATABASE_URL` without pooler |
| `PORT` | No | HTTP + WebSocket port (default `8080`) |
| `REDIS_URL` | No | Redis URL (default `redis://localhost:6379`) |

\*Required by `schema.prisma` when using `directUrl`.

### `apps/web`

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL for HTTP calls (default `http://localhost:8080`) |
| `NEXT_PUBLIC_WS_URL` | WebSocket base URL (default `ws://localhost:8080`) |

## Local development

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Configure env

   - Create `.env` files (or export vars) so `apps/ws-server` has `JWT_SECRET`, `DATABASE_URL`, and `DIRECT_URL`.
   - Start **PostgreSQL** and **Redis**.

3. Apply database schema

   From `packages/db`, point `DATABASE_URL` / `DIRECT_URL` at your Postgres, then sync the schema (e.g. `pnpm exec prisma db push` for local dev, or your team’s migration workflow). SQL under `packages/db/prisma/migrations/` may need to be applied if you rely on those scripts.

   `pnpm install` runs `prisma generate` via the db package’s `postinstall`.

4. Run apps

   ```bash
   pnpm dev
   ```

   - Web: [http://localhost:3000](http://localhost:3000)
   - Game server (HTTP + WS): [http://localhost:8080](http://localhost:8080) — WebSocket: `ws://localhost:8080`

   You can also run **`pnpm --filter web dev`** and **`pnpm --filter @chess/ws-server dev`** in two terminals if you prefer.

## Build

```bash
pnpm run build
```

Turborepo caches task outputs where configured.

## Docker

`docker-compose.yml` starts **web**, **ws-server**, and **PostgreSQL**. For a working game server you still need:

- **`JWT_SECRET`** (and ideally **`REDIS_URL`**) set for the `ws-server` service — extend `docker-compose.yml` to pass them in, and add a **Redis** service if you want everything in Compose.
- Database migrations applied to the Postgres volume (run Prisma migrate against the composed DB when first bringing the stack up).

Adjust the web service build/runtime env so **`NEXT_PUBLIC_API_URL`** and **`NEXT_PUBLIC_WS_URL`** point at the hostname/port clients use to reach the ws-server (e.g. host machine vs container network).

## License

UNLICENSED (see root `package.json`).
