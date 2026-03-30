# Chess

Real-time multiplayer chess with accounts, rated games, server-authoritative clocks, spectator mode, and a horizontally-scalable WebSocket backend.

![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-53%20tests-6E9F18?logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## Architecture

```mermaid
graph TD
    Browser["Browser"]
    WEB["Next.js :3000"]
    WS["ws-server :8080\n(Node.js)"]
    PG[("PostgreSQL :5432")]
    R[("Redis :6379")]

    Browser -->|"Next.js pages"| WEB
    Browser -->|"HTTP REST"| WS
    Browser -->|"WebSocket"| WS
    WS -->|"Prisma ORM"| PG
    WS -->|"ioredis pub/sub + cache"| R
    WEB -->|"API calls"| WS
```

All four services run as Docker containers on the same Compose network. The ws-server is **stateless** — all shared game state lives in Redis, so you can run multiple instances behind a load balancer.

---

## Features

### Auth
- Signup / signin over HTTP (`POST /auth/signup`, `POST /auth/signin`)
- Passwords hashed with bcryptjs (configurable rounds)
- JWT sessions (HS256, 7-day expiry) stored in `localStorage`
- WebSocket auth: token passed as URL query param, verified before upgrade

### Matchmaking
- Redis FIFO queue (`LPUSH` / atomic Lua `RPOP` pair)
- O(1) dequeue — no polling loops
- Players are matched and notified over pub/sub, never need to poll

### Gameplay
- Move validation on the server via a chess.js wrapper (shared package)
- All standard rules: castling, en passant, pawn promotion
- Clocks: 5 minutes per side, 100 ms server tick, `TIME_UPDATE` push
- Resign, draw offer / accept / decline
- Game over: checkmate, timeout, resignation, mutual agreement

### Ratings
- ELO algorithm (K-factor 32) applied after every game
- Rating snapshot recorded at game start; delta shown in game-over modal
- Leaderboard sorted by current rating (`GET /leaderboard`)

### Spectating
- `GET /games/active` lists games in progress
- Spectators join via `?spectate=<gameId>` WebSocket param
- Board hydrated from HTTP move history, then live moves stream over WebSocket

### Reconnection
- Same user can open a new socket mid-game
- Server swaps the socket reference and sends current FEN + remaining clocks
- No move is lost; clock continues without interruption

### Frontend
- Next.js 16 / React 19 with Tailwind CSS and Framer Motion
- Click-to-move with valid-move indicators (dots for empty squares, rings for captures)
- Move history panel (SAN notation)
- Sound effects via Web Audio API (no external files)
- Dark mode

---

## Request Flows

### Matchmaking

```mermaid
sequenceDiagram
    participant A as Player A
    participant B as Player B
    participant WS as ws-server
    participant R as Redis

    A->>WS: WS connect + JWT
    A->>WS: { type: "init_game" }
    WS->>R: LPUSH matchmaking:queue "userA"

    B->>WS: WS connect + JWT
    B->>WS: { type: "init_game" }
    WS->>R: LPUSH matchmaking:queue "userB"
    WS->>R: Lua RPOP pair → ["userA","userB"]
    WS->>R: SET game:id:state (FEN, clocks)
    WS->>R: PUBLISH user:userA:notify
    WS->>R: PUBLISH user:userB:notify

    R-->>A: INIT_GAME { color:"white", gameId }
    R-->>B: INIT_GAME { color:"black", gameId }
```

### Making a Move

```mermaid
sequenceDiagram
    participant P as Player (White)
    participant WS as ws-server
    participant ENG as chess.js engine
    participant R as Redis
    participant DB as PostgreSQL

    P->>WS: { type:"move", from:"e2", to:"e4" }
    WS->>WS: checkRateLimit (token bucket)
    WS->>ENG: tryMove({ from, to })
    ENG-->>WS: move result (SAN, FEN)
    WS->>R: SET game:state + RPUSH game:moves + PUBLISH game:live
    WS-->>P: { type:"move", payload }
    WS-->>Opponent: { type:"move", payload }
    WS--)DB: saveMove() fire-and-forget
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js + React | 16 / 19 |
| Styling | Tailwind CSS + Framer Motion | 4 / 12 |
| Backend runtime | Node.js | 20 |
| WebSocket | ws | 8.18 |
| Auth | jsonwebtoken + bcryptjs | 9 / 2.4 |
| Validation | Zod | 3.24 |
| Database | PostgreSQL + Prisma | 15 |
| Cache / pub-sub | Redis + ioredis | 7 / 5.4 |
| Chess rules | chess.js (wrapped in `@chess/chess-engine`) | — |
| Monorepo | Turborepo + pnpm workspaces | — |
| Tests | Vitest + @vitest/coverage-v8 | 4.1 |
| Containers | Docker + Docker Compose | — |

---

## Performance

| Characteristic | Value | Notes |
|---|---|---|
| Rate limit | 10 msg/s per socket | Token bucket; socket closed after 5 consecutive overages |
| Clock resolution | 100 ms | Server-authoritative `TIME_UPDATE` every 100 ms |
| Matchmaking | O(1) | Lua atomic RPOP from Redis list |
| DB writes | Fire-and-forget | `.catch()` logged; Redis is the synchronous source of truth |
| Redis throughput | ~50 k msg/s | Single Redis 7 node (official benchmark) |
| Messages per active game | ~20 msg/s | 10 `TIME_UPDATE` ticks × 2 players |
| Concurrent games (1 node) | ~2 500 | 50 k ÷ 20 msg/game/s |
| Horizontal scaling | Yes | Stateless ws-server; add nodes behind a load balancer |

---

## Database Schema

```mermaid
erDiagram
    Profile {
        uuid id PK
        string username
        int rating
        int wins
        int losses
        int draws
    }
    Credentials {
        uuid id PK
        uuid profileId FK
        string passwordHash
    }
    Game {
        uuid id PK
        uuid whitePlayerId FK
        uuid blackPlayerId FK
        int whiteRating
        int blackRating
        enum winner
        string reason
        string pgn
        int whiteRatingChange
        int blackRatingChange
    }
    GameMove {
        uuid id PK
        uuid gameId FK
        int moveNumber
        string moveSan
        string moveUci
        string fen
        int whiteTime
        int blackTime
    }

    Profile ||--|| Credentials : "has"
    Profile ||--o{ Game : "white"
    Profile ||--o{ Game : "black"
    Game ||--o{ GameMove : "has"
```

---

## WebSocket Protocol

### Client → Server

| `type` | Payload | Description |
|---|---|---|
| `init_game` | — | Join matchmaking queue |
| `move` | `{ from, to, promotion? }` | Submit a move |
| `resign` | — | Forfeit the game |
| `draw_offer` | — | Propose a draw |
| `draw_decline` | — | Reject opponent's draw offer |

### Server → Client

| `type` | Payload | Description |
|---|---|---|
| `init_game` | `{ color, gameId, fen?, whiteTime?, blackTime?, resumed? }` | Game started or reconnected |
| `move` | `{ from, to, san, promotion? }` | Move confirmed and broadcast |
| `invalid_move` | `{ move, error }` | Move rejected |
| `time_update` | `{ whiteTime, blackTime }` | Clock tick (every 100 ms) |
| `game_over` | `{ winner, reason, whiteRatingChange, blackRatingChange }` | Game ended |
| `draw_offer` | — | Opponent offered a draw |
| `draw_decline` | — | Opponent declined your draw offer |

All messages validated server-side with Zod discriminated unions. Invalid or malformed messages are silently dropped.

---

## Project Structure

```
chess/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── app/                # App Router pages
│   │   └── components/         # UI components
│   └── ws-server/              # WebSocket + HTTP backend
│       ├── src/
│       │   ├── GameManager.ts  # Routes WS messages, rate limiting
│       │   ├── game.ts         # Game class (moves, clocks, ELO)
│       │   ├── services/
│       │   │   ├── RedisService.ts
│       │   │   └── DatabaseService.ts
│       │   └── __tests__/      # 53 Vitest unit tests
│       └── vitest.config.ts
├── packages/
│   ├── chess-engine/           # chess.js TypeScript wrapper
│   ├── db/                     # Prisma schema + migrations
│   └── types/                  # Shared message constants + Zod schemas
├── docker-compose.yml
└── turbo.json
```

---

## Local Setup

### Option A — Docker (zero local dependencies)

```bash
git clone <repo-url> chess
cd chess
docker compose up --build
```

Open `http://localhost:3000`. Register two accounts in separate tabs and play.

### Option B — Hot reload dev

```bash
# Prerequisites: Node 20, pnpm, Docker (for Postgres + Redis only)
git clone <repo-url> chess
cd chess

docker compose up -d db redis

pnpm install

cp apps/ws-server/.env.example apps/ws-server/.env
# Fill in JWT_SECRET in the .env file

pnpm --filter @repo/db exec prisma migrate dev

pnpm dev
```

---

## Environment Variables

| Variable | Service | Default (dev) | Description |
|---|---|---|---|
| `DATABASE_URL` | ws-server | `postgresql://postgres:password@localhost:5433/chess_db` | Prisma connection string |
| `REDIS_URL` | ws-server | `redis://localhost:6379` | ioredis connection string |
| `JWT_SECRET` | ws-server | *(required)* | HS256 signing key — change in production |
| `JWT_EXPIRES_IN` | ws-server | `7d` | JWT expiry duration |
| `BCRYPT_ROUNDS` | ws-server | `10` | bcryptjs cost factor |
| `PORT` | ws-server | `8080` | HTTP + WebSocket listen port |
| `NEXT_PUBLIC_WS_URL` | web | `ws://localhost:8080` | WebSocket server URL (browser) |
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:8080` | HTTP API base URL |

---

## Tests

```bash
pnpm --filter @chess/ws-server test           # run once
pnpm --filter @chess/ws-server test:watch     # watch mode
pnpm --filter @chess/ws-server test:coverage  # coverage report
```

```
Test Suites  4 passed
Tests        53 passed

calcElo.test.ts        9   ELO boundary cases (K=32, win/loss/draw, rating gaps)
redisService.test.ts  15   pub/sub routing, matchmaking dequeue, game state ops
rateLimit.test.ts     16   token bucket refill, overage close, GameManager routing
game.test.ts          13   moves, resign, draw offer/accept/decline, reconnect
```

---

## Roadmap

- [ ] CI/CD — GitHub Actions: lint → build → test on every PR
- [ ] Structured logging — replace `console.*` with Pino (JSON output, log levels)
- [ ] Deep health check — `/healthz` pings Redis + DB; returns 503 on failure
- [ ] Zod validation on HTTP routes — consistent with the WS validation layer
- [ ] Game replay — `/game/:id` page with forward / back controls
- [ ] Time control selection — bullet / blitz / rapid / classical; separate queues per format
- [ ] Stockfish analysis — WASM Web Worker + evaluation bar on the replay page
- [ ] Private lobby — challenge a friend via a 6-character code (10-minute Redis TTL)
- [ ] Prometheus metrics — `/metrics` with `prom-client` (active games, moves/s, queue depth)
- [ ] Stalemate UI feedback
- [ ] Sound toggle in UI
