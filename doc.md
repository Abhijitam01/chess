# Chess App — Complete Codebase Documentation

> A production-ready real-time multiplayer chess platform built with a Turborepo monorepo.
> This document covers every feature, every service, every design decision, and every piece of infrastructure.

---

## Table of Contents

1. [What this app does](#1-what-this-app-does)
2. [Monorepo structure](#2-monorepo-structure)
3. [Database — PostgreSQL + Prisma](#3-database--postgresql--prisma)
4. [Redis — what it is and how we use it](#4-redis--what-it-is-and-how-we-use-it)
5. [Auth system](#5-auth-system)
6. [WebSocket server — entry point](#6-websocket-server--entry-point)
7. [GameManager — matchmaking, lobbies, routing](#7-gamemanager--matchmaking-lobbies-routing)
8. [Game — chess logic, clock, ELO](#8-game--chess-logic-clock-elo)
9. [HTTP API endpoints](#9-http-api-endpoints)
10. [WebSocket message protocol](#10-websocket-message-protocol)
11. [Frontend application](#11-frontend-application)
12. [Shared packages](#12-shared-packages)
13. [Docker and deployment](#13-docker-and-deployment)
14. [Design decisions explained](#14-design-decisions-explained)

---

## 1. What this app does

This is a real-time chess game you can play in your browser. Two players connect, are matched together, and play a full game of chess with:

- Timed games (bullet, blitz, rapid, classical)
- ELO rating that goes up when you win and down when you lose
- Resignation and draw offers
- Private lobbies (share a 6-character code with a friend to play them directly)
- Spectator mode (watch any ongoing game live)
- Game replay (step through any completed game move by move)
- Leaderboard and player profiles
- Automatic reconnection if your internet drops

---

## 2. Monorepo structure

The project uses **pnpm workspaces** with **Turborepo** to manage multiple apps and packages in one repo.

```
chess/
├── apps/
│   ├── web/              — Next.js 15 frontend (port 3000)
│   └── ws-server/        — Node.js WebSocket + HTTP server (port 8080)
├── packages/
│   ├── types/            — @repo/types — shared TypeScript types and message constants
│   ├── db/               — @repo/db — Prisma client and generated types
│   ├── chess-engine/     — @chess/chess-engine — wrapper around chess.js
│   └── ui/               — @repo/ui — React UI components (ChessBoard, etc.)
├── turbo.json            — Turborepo pipeline
├── pnpm-workspace.yaml   — workspace definitions
└── docker-compose.yml    — runs web + ws-server in containers
```

**Why Turborepo?** It caches build outputs and only rebuilds packages that changed. If you edit `packages/types`, Turborepo knows to rebuild both `apps/web` and `apps/ws-server` because they depend on it. Without Turborepo you'd have to manually rebuild everything on every change.

**Why pnpm?** Faster than npm, uses hard links instead of copies so `node_modules` takes much less disk space, and has first-class workspace support.

---

## 3. Database — PostgreSQL + Prisma

### Why PostgreSQL

PostgreSQL stores the permanent record of everything: user accounts, passwords, completed games, move history, and ratings. It's the source of truth for data that must survive server restarts.

### Schema

**Profile** — one row per user

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key, auto-generated |
| `username` | String (unique) | Display name, used for login |
| `rating` | Int (default 1000) | ELO rating, starts at 1000 |
| `totalGames` | Int | Total games played |
| `wins` | Int | Games won |
| `losses` | Int | Games lost |
| `draws` | Int | Games drawn |
| `createdAt` | DateTime | Account creation time |
| `updatedAt` | DateTime | Auto-updated on any change |

**Credentials** — separate from Profile for security

| Column | Type | Purpose |
|--------|------|---------|
| `profileId` | String (FK → Profile) | Links to the profile |
| `passwordHash` | String | bcrypt hash (10 rounds) |

The credentials are kept in a separate table so that queries that only need the profile (e.g., looking up a username for the leaderboard) never accidentally read the password hash.

**Game** — one row per game played

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `whitePlayerId` | String? (FK → Profile) | Who played white |
| `blackPlayerId` | String? (FK → Profile) | Who played black |
| `winner` | String? | `'white'`, `'black'`, `'draw'`, or null if ongoing |
| `resultReason` | String? | `'checkmate'`, `'stalemate'`, `'resignation'`, `'timeout'`, `'agreement'` |
| `pgn` | String? | Full game in Portable Game Notation |
| `initialWhiteRating` | Int | White's rating at the start of this game |
| `initialBlackRating` | Int | Black's rating at the start of this game |
| `whiteRatingChange` | Int? | How many ELO points white gained/lost |
| `blackRatingChange` | Int? | How many ELO points black gained/lost |
| `startedAt` | DateTime | When the game started |
| `finishedAt` | DateTime? | When the game ended |

**GameMove** — one row per move in a game

| Column | Type | Purpose |
|--------|------|---------|
| `id` | BigInt (auto) | Primary key |
| `gameId` | String (FK → Game) | Which game this move belongs to |
| `moveNumber` | Int | Move number (1, 2, 3...) |
| `moveSan` | String | Standard Algebraic Notation (e.g., `"Nf3"`) |
| `moveUci` | String | UCI notation (e.g., `"g1f3"`) — from-square + to-square + optional promotion piece |
| `fen` | String | Board position after this move in FEN format |
| `timeLeftWhite` | Int? | White's remaining clock in milliseconds |
| `timeLeftBlack` | Int? | Black's remaining clock in milliseconds |

### Prisma

Prisma is the ORM (Object-Relational Mapper). You write a schema in `schema.prisma`, run `prisma generate`, and get a fully-typed TypeScript client. No raw SQL needed.

```typescript
// Example: get a user's 10 most recent games including opponent info
const games = await prisma.game.findMany({
  where: { OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }] },
  orderBy: { createdAt: 'desc' },
  take: 10,
  include: { whitePlayer: true, blackPlayer: true },
});
```

---

## 4. Redis — what it is and how we use it

### What is Redis?

Redis is an in-memory data store — think of it as a superfast dictionary that lives in RAM instead of on disk. Because it's in memory, reads and writes are microseconds instead of milliseconds. It also supports **pub/sub** (publish/subscribe), a messaging pattern where one process publishes a message to a channel and any number of subscribers receive it instantly.

We use Redis for two main things:
1. **Live game state** — the current board position, whose turn it is, and the clock. Stored here so it's fast and doesn't block the database.
2. **Message broker** — routing messages between server nodes. If two players are connected to different server instances, Redis pub/sub is how they talk to each other.

### Redis data keys

| Key pattern | Type | TTL | What it stores |
|-------------|------|-----|----------------|
| `game:{gameId}:state` | JSON string | 24h (1h after finish) | Current game state: FEN, times, turn, status, player IDs |
| `game:{gameId}:moves` | List | 24h | All moves so far as JSON objects |
| `user:{userId}:activeGame` | String | 24h | The gameId of the user's current game |
| `active_games` | Set | no TTL | Set of all currently active gameIds |
| `matchmaking:queue` | List | no TTL | Queue of userIds waiting for a match |
| `lobby:{code}` | String | 600s (10 min) | The creatorId for a private lobby code |

### Redis pub/sub channels

| Channel pattern | Purpose |
|-----------------|---------|
| `game:{gameId}:live` | Every move broadcast to spectators watching this game |
| `game:{gameId}:moves_in` | Non-owner nodes send player actions here for the game owner to process |
| `game:{gameId}:events` | Game owner sends processed events (moves, game_over) for non-owner nodes to forward |
| `user:{userId}:notify` | Cross-node match notifications — "you've been matched, your gameId is X" |
| `user:{userId}:game_msg` | Direct game messages (INIT_GAME, CLOCK_SYNC) routed to a specific user across nodes |

### Why two Redis clients?

Redis has a rule: once you put a connection into subscribe mode, it can only send subscribe/unsubscribe commands — it can't do regular reads/writes. So we always have two connections:
- `client` — for all regular operations (GET, SET, LPUSH, EVAL, PUBLISH, etc.)
- `subClient` — exclusively for subscriptions (SUBSCRIBE, UNSUBSCRIBE)

### Lua scripting — atomic operations

Some operations need to be atomic (either both happen or neither happens). Redis supports this with Lua scripts, which run entirely on the Redis server without interruption.

**Matchmaking dequeue** — pop two users from the queue atomically. Without this, two server nodes could both see 2 users in the queue and both try to match them, creating duplicate games.

```lua
local count = redis.call('LLEN', KEYS[1])
if count >= 2 then
  local u1 = redis.call('rpop', KEYS[1])
  local u2 = redis.call('rpop', KEYS[1])
  return {u1, u2}
end
return nil
```

**Lobby pop** — GET the creator ID and DELETE the key in one atomic operation. Without this, two users could both read the key before either deletes it and both think they joined the same lobby.

```lua
local v = redis.call('GET', KEYS[1])
if v then
  redis.call('DEL', KEYS[1])
  return v
end
return nil
```

### Game state lifecycle in Redis

```
1. Game created   → SET game:{id}:state (24h TTL)
                  → SET user:{white}:activeGame (24h TTL)
                  → SET user:{black}:activeGame (24h TTL)
                  → SADD active_games {id}

2. Move made      → Update game:{id}:state (reset TTL)
                  → RPUSH game:{id}:moves (append move)
                  → PUBLISH game:{id}:live (spectators receive instantly)

3. Game ends      → Update game:{id}:state → status='finished' (1h TTL)
                  → DEL user:{white}:activeGame
                  → DEL user:{black}:activeGame
                  → SREM active_games {id}
```

After 1 hour the finished game state expires from Redis. The permanent record is in PostgreSQL (the `games` and `game_moves` tables). The replay endpoint tries Redis first (for live/recently-finished games) and falls back to the database if Redis no longer has the moves.

---

## 5. Auth system

### How signup works

1. Client POSTs `{ username, password }` to `/auth/signup`
2. Server validates with Zod schema:
   - Username: 3–20 chars, letters/numbers/underscores only
   - Password: 8–100 chars
3. `AuthService.signup()` hashes the password with bcrypt (10 rounds)
4. Creates a `Profile` and `Credentials` row in a single database transaction
5. Returns a JWT token signed with `JWT_SECRET`

### How signin works

1. Client POSTs `{ username, password }` to `/auth/signin`
2. Looks up the profile + credentials by username
3. Compares the submitted password against the stored bcrypt hash
4. If they match, returns a JWT token
5. If they don't match (or the user doesn't exist), returns a generic "Invalid credentials" error — never reveals whether the username exists

### JWT tokens

Tokens are stateless — there's no session table in the database. Every WebSocket connection passes `?token=...` in the URL. The server verifies the signature using `JWT_SECRET` and extracts the `userId`. If the token is missing or invalid, the connection is closed immediately.

Token expiry: 7 days.

### WebSocket auth

Every WebSocket connection must include a valid token:

```
ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIs...
```

Optional: spectate mode

```
ws://localhost:8080?token=...&spectate={gameId}
```

If `spectate` is present, the connection is added as a spectator instead of a player.

---

## 6. WebSocket server — entry point

`apps/ws-server/src/index.ts` is the entry point. It:

1. Creates `DatabaseService`, `RedisService`, and `AuthService` instances
2. Connects to Redis
3. Creates an HTTP server and attaches a WebSocket server to it (they share the same port — HTTP handles REST endpoints and WebSocket upgrades)
4. On each new WebSocket connection:
   - Extracts `token` and optional `spectate` from the query string
   - Verifies the JWT — closes with code 1008 if invalid
   - If spectating: calls `gameManager.addSpectator(gameId, ws)`
   - Otherwise: calls `gameManager.addUserToGame(ws, userId)`
5. Handles graceful shutdown:
   - On SIGTERM/SIGINT, stops accepting new connections
   - Sends `server_shutdown` to all connected clients so they know to reconnect
   - Waits up to 30 seconds for in-flight game writes to complete
   - Disconnects from Redis cleanly

### Logging

Uses **Pino** (a fast structured JSON logger). Every log line is a JSON object with a timestamp, level, and context fields. This is much better than `console.log` because logs can be indexed and searched in production (e.g., in Datadog or CloudWatch).

```json
{"level":30,"time":1711800000000,"msg":"Server listening on port 8080","port":8080}
{"level":40,"time":1711800001000,"err":{"message":"..."},"userId":"abc123","msg":"[RemotePlayerProxy] send failed"}
```

---

## 7. GameManager — matchmaking, lobbies, routing

`apps/ws-server/src/GameManager.ts` is the central coordinator. It keeps track of every player and game on this server node.

### Internal state

| Map | Key → Value | Purpose |
|-----|-------------|---------|
| `socketToUserId` | WebSocket → userId | Which user owns this socket |
| `userIdToSocket` | userId → WebSocket | Reverse lookup for sending messages |
| `userIdToGame` | userId → Game | Games owned by this node |
| `remoteGameIds` | userId → gameId | Games owned by a different node |
| `spectatorSockets` | gameId → Set\<WebSocket\> | All spectators per game |
| `rateBuckets` | WebSocket → bucket | Rate limit state per socket |

### Rate limiting

Each socket gets a token bucket: 10 messages per second. The bucket is refilled continuously based on elapsed time. If a socket sends more than 10 msg/s, tokens run out and messages are dropped. If this happens 5 times in a row, the socket is closed with code 1008.

This prevents a malicious or buggy client from flooding the server with messages.

### Matchmaking flow

When a player sends `INIT_GAME`:

1. **Reconnect to local game** — if they were in a game on this node and it's still running, `reconnectPlayer()` is called. The client gets the current FEN, remaining times, and an immediate clock sync.

2. **Reconnect to remote game** — if `remoteGameIds` has an entry for this user, subscribe to their game messages channel and start forwarding.

3. **Clean stale active-game** — if Redis shows the user has an active game but it's not tracked on any node, clean it up.

4. **Enqueue for matchmaking** — push userId to the `matchmaking:queue` list in Redis (deduped with `LREM` first).

5. **Try to dequeue a pair** — run the atomic Lua script. If two users are in the queue, pop them both and create a game immediately.

6. **Wait for cross-node match** — if only one user is in the queue, subscribe to `user:{userId}:notify`. When another node matches this user, it publishes a `match_found` notification with the gameId. This node then starts forwarding game messages to the local socket.

### RemotePlayerProxy

When two matched players are on different server nodes, the game engine runs on one node (the "owner"). The other node needs to send messages to the remote player. `RemotePlayerProxy` implements just enough of the WebSocket interface (`send()` and `readyState`) to work transparently with the `Game` class. Its `send()` publishes to `user:{userId}:game_msg` instead of writing to a socket.

### Private lobby flow

**Creating a lobby:**
1. Generate a 6-char hex code using `webcrypto.getRandomValues(new Uint8Array(3)).toString('hex')` — this is cryptographically secure randomness. Never `Math.random()`, which is predictable.
2. Store `lobby:{code} → creatorId` in Redis with NX (only set if not exists) and 600s TTL.
3. If NX fails (collision — probability ~1/16 million for 6-char hex), retry up to 5 times.
4. Send `LOBBY_CREATED { code }` back to the creator.

**Joining a lobby:**
1. Run the atomic `popLobby` Lua script: GET the creatorId + DELETE the key atomically.
2. If nothing returned: send `LOBBY_NOT_FOUND` (code expired or unknown).
3. If `creatorId === userId`: creator tried to join their own lobby — send `LOBBY_NOT_FOUND` to prevent a self-game.
4. Otherwise: create a game with creator as white, joiner as black.

---

## 8. Game — chess logic, clock, ELO

`apps/ws-server/src/game.ts` manages one chess game from start to finish.

### Construction

```typescript
new Game(player1, player2, whitePlayerId, blackPlayerId, dbService, redisService, onReady, timeControl)
```

On creation:
1. Loads both players' current ratings from the database in parallel.
2. Creates a `Game` row in the database.
3. Calls `onReady(gameId)` — this lets GameManager subscribe to the moves_in channel for cross-node routing.
4. Calls `redisService.initGame(...)` to set up Redis state.
5. Sends `INIT_GAME { color, gameId }` to both players.
6. Starts the clock and the clock sync interval.

### Time controls

Defined in `@repo/types`:

| Key | Label | Time |
|-----|-------|------|
| `bullet` | Bullet (1 min) | 60,000 ms per player |
| `blitz` | Blitz (5 min) | 300,000 ms per player |
| `rapid` | Rapid (10 min) | 600,000 ms per player |
| `classical` | Classical (30 min) | 1,800,000 ms per player |

Default: `blitz` (5 minutes).

### Dual-timeline clock

The clock uses two intervals:

**Local interval (100ms)** — runs every 100ms, subtracts elapsed time from the active player's clock, and broadcasts `TIME_UPDATE { whiteTime, blackTime }` to both players. This gives a smooth countdown in the UI.

**Sync interval (3s)** — runs every 3 seconds, broadcasts `CLOCK_SYNC { whiteTime, blackTime, serverTs }` with the authoritative server time. The client only applies this if the drift from its local estimate is > 500ms. This corrects clock drift without causing jitter from normal network variance.

**Immediate sync on reconnect** — when a player reconnects, they immediately receive a `CLOCK_SYNC` message. Without this they'd wait up to 3 seconds with a stale clock.

### Making a move

```typescript
async makeMove(socket, { from, to, promotion }): Promise<void>
```

1. Ignore if game is finished.
2. Check it's the right player's turn (white can't play for black).
3. Call `engine.tryMove(move)` — chess.js validates and applies the move.
4. If invalid: send `INVALID_MOVE` back to the sender only.
5. If valid:
   - Reset `lastMoveTime` (so the clock charges the next player from now).
   - `await redisService.publishMove(...)` — update game state + move list in Redis, publish to the `:live` channel for spectators. **Awaited** because Redis is source of truth for live state.
   - `dbService.saveMove(...).catch(...)` — save to DB **fire-and-forget**. DB is secondary; don't block the move acknowledgment waiting for a disk write.
   - Broadcast the move to both players.
   - Check if the game is over.

### Game over reasons

| Reason | Trigger | Winner |
|--------|---------|--------|
| `checkmate` | `engine.isCheckmate()` returns true | Opponent of whoever is in check |
| `stalemate` | `engine.isStalemate()` returns true | None (draw) |
| `timeout` | A player's clock hits 0 | The player who still has time |
| `resignation` | Player sends `RESIGN` | Opponent |
| `agreement` | Both players accept a draw | None (draw) |

When a game ends, all of these happen in parallel:
- `dbService.updateGame(...)` — write winner, reason, PGN, rating changes
- `redisService.finishGame(...)` — mark state as finished, delete active-game keys, remove from active set
- `dbService.updateProfileStats(whitePlayerId, ...)` — increment wins/losses/draws, add rating delta
- `dbService.updateProfileStats(blackPlayerId, ...)`

### Draw offers

1. Player A sends `DRAW_OFFER` — stored in `pendingDrawFrom`.
2. Player B receives a `DRAW_OFFER` message.
3. Player B sends `DRAW_ACCEPT` or `DRAW_DECLINE`.
4. If accept: `handleDrawAgreement()` ends the game with reason `'agreement'`.
5. If decline: `DRAW_DECLINE` sent back to Player A, `pendingDrawFrom` cleared.
6. Edge case: if Player A tries to offer again while one is pending, the offer is ignored.

### ELO rating system

```typescript
const K_FACTOR = 32;

export function calcElo(playerRating, opponentRating, actual: 1 | 0 | 0.5): number {
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(K_FACTOR * (actual - expected));
}
```

- `actual` = 1 for a win, 0 for a loss, 0.5 for a draw
- `expected` = the probability of winning based on the rating difference
- `change` = K_FACTOR × (actual − expected)
- K_FACTOR = 32: higher means ratings change faster. Standard for new players.

**Example:** Player A (1200) vs Player B (1000), A wins.
- Expected for A = 1 / (1 + 10^((1000−1200)/400)) = 1 / (1 + 10^(−0.5)) ≈ 0.76
- Change for A = 32 × (1 − 0.76) ≈ +8
- Change for B = 32 × (0 − 0.24) ≈ −8

An upset (lower-rated player wins) produces a larger rating swing. A win against an equal opponent is worth ~16 points.

---

## 9. HTTP API endpoints

All endpoints are on port 8080 (the same port as WebSocket). They're handled by `createAuthHandler` in `apps/ws-server/src/routes/auth.ts`.

### GET /health or /healthz

Kubernetes liveness probe. Pings both the database and Redis.

**Response 200:**
```json
{ "success": true, "data": { "status": "ok", "db": true, "redis": true } }
```

**Response 503 (if either is down):**
```json
{ "success": false, "data": { "status": "unhealthy", "db": false, "redis": true } }
```

### POST /auth/signup

Create an account.

**Request:**
```json
{ "username": "alice", "password": "mysecretpassword" }
```

**Validation:**
- `username`: 3–20 characters, alphanumeric + underscores only
- `password`: 8–100 characters

**Response 201:**
```json
{ "success": true, "data": { "token": "eyJ...", "userId": "uuid", "username": "alice" } }
```

**Response 400 (validation failure):**
```json
{ "success": false, "error": "username: Username may only contain letters, numbers, and underscores" }
```

### POST /auth/signin

Sign in to an existing account.

**Request:**
```json
{ "username": "alice", "password": "mysecretpassword" }
```

**Response 200:**
```json
{ "success": true, "data": { "token": "eyJ...", "userId": "uuid", "username": "alice" } }
```

**Response 400:**
```json
{ "success": false, "error": "Invalid credentials" }
```

Note: same error for wrong password and nonexistent username — this prevents username enumeration attacks.

### GET /leaderboard?limit=50

Top players by ELO rating.

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "username": "alice", "rating": 1842, "wins": 120, "losses": 45, "draws": 12, "totalGames": 177 }
  ]
}
```

Max limit: 100.

### GET /profile/:username

Player profile and recent games.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "alice",
    "rating": 1842,
    "wins": 120,
    "losses": 45,
    "draws": 12,
    "totalGames": 177,
    "recentGames": [ ... ]
  }
}
```

### GET /games/active

All live games currently in progress. Used by the spectator lobby.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "game-uuid",
      "whitePlayer": { "username": "alice", "rating": 1842 },
      "blackPlayer": { "username": "bob", "rating": 1654 },
      "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
      "turn": "b"
    }
  ]
}
```

Note: all player profiles are loaded in a single `prisma.profile.findMany({ where: { id: { in: [...] } } })` query, not one query per game. This avoids the N+1 query problem.

### GET /games/:id/moves

Move history for a game. Used by the replay page.

**Strategy:** Try Redis first (for live or recently-finished games). If Redis returns nothing (game expired from cache), fall back to the `game_moves` table in PostgreSQL.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "moves": [
      { "san": "e4", "uci": "e2e4", "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", "whiteTime": 298500, "blackTime": 300000, "moveNumber": 1 }
    ],
    "fen": "current position FEN or null"
  }
}
```

---

## 10. WebSocket message protocol

All messages are JSON. Connect with `ws://host:8080?token=YOUR_JWT_TOKEN`.

### Client → Server messages

| Type | Payload | Meaning |
|------|---------|---------|
| `init_game` | none | Request a match (or reconnect to existing game) |
| `move` | `{ from, to, promotion? }` | Make a chess move. Squares in algebraic notation (e.g., `"e2"`, `"e4"`). Optional `promotion` for pawn promotion: `"q"`, `"r"`, `"b"`, `"n"`. |
| `resign` | none | Give up the current game |
| `draw_offer` | none | Offer a draw to the opponent |
| `draw_accept` | none | Accept the opponent's draw offer |
| `draw_decline` | none | Decline the opponent's draw offer |
| `create_lobby` | none | Create a private lobby and receive an invite code |
| `join_lobby` | `{ code: "a1b2c3" }` | Join a private lobby by 6-char hex code |

### Server → Client messages

| Type | Payload | Meaning |
|------|---------|---------|
| `init_game` | `{ color, gameId, fen?, whiteTime?, blackTime?, resumed? }` | Game is starting. `color` is `"white"` or `"black"`. If reconnecting, `resumed: true` and current board state are included. |
| `move` | `{ from, to, san, promotion? }` | A move was made (by either player). |
| `game_over` | `{ winner, reason, whiteRatingChange, blackRatingChange }` | Game ended. `winner` is `"white"`, `"black"`, or `null` for draw. |
| `time_update` | `{ whiteTime, blackTime }` | Clock tick. Both values in milliseconds. Sent every 100ms. |
| `clock_sync` | `{ whiteTime, blackTime, serverTs }` | Authoritative clock. Sent every 3 seconds and immediately on reconnect. Client applies this if drift > 500ms. |
| `invalid_move` | `{ move, error }` | The move you tried was illegal. |
| `draw_offer` | none | Opponent offered you a draw. |
| `draw_decline` | none | Opponent declined your draw offer. |
| `lobby_created` | `{ code }` | Your private lobby was created. Share this code with a friend. |
| `lobby_not_found` | none | The code you tried to join is expired or unknown. |
| `AUTH_ERROR` | `{ message }` | Token was missing or invalid. Connection will close. |
| `server_shutdown` | `{ message }` | Server is restarting. Reconnect automatically. |
| `opponent_left` | `{ message }` | Opponent disconnected. |

### Full game flow example

```
Player A connects: ws://...?token=A_TOKEN
Player B connects: ws://...?token=B_TOKEN

A → server:  { type: "init_game" }
B → server:  { type: "init_game" }

-- Server matches them --

server → A:  { type: "init_game", payload: { color: "white", gameId: "xyz" } }
server → B:  { type: "init_game", payload: { color: "black", gameId: "xyz" } }

-- Clock starts (white moves first) --

A → server:  { type: "move", move: { from: "e2", to: "e4" } }
server → A:  { type: "move", payload: { from: "e2", to: "e4", san: "e4" } }
server → B:  { type: "move", payload: { from: "e2", to: "e4", san: "e4" } }

B → server:  { type: "move", move: { from: "e7", to: "e5" } }
server → A:  { type: "move", payload: { from: "e7", to: "e5", san: "e5" } }
server → B:  { type: "move", payload: { from: "e7", to: "e5", san: "e5" } }

-- ... many moves later ...

server → A:  { type: "game_over", payload: { winner: "white", reason: "checkmate", whiteRatingChange: 12, blackRatingChange: -12 } }
server → B:  { type: "game_over", payload: { winner: "white", reason: "checkmate", whiteRatingChange: 12, blackRatingChange: -12 } }
```

---

## 11. Frontend application

`apps/web` is a Next.js 15 application using the App Router.

### Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page with hero section and login/signup |
| `/game` | `app/game/page.tsx` | Quick match — finds an opponent automatically |
| `/game/[id]` | `app/game/[id]/page.tsx` | Game replay — step through a completed game |
| `/spectate/[id]` | `app/spectate/[id]/page.tsx` | Watch a live game in real time |

### Key hooks

**`useWebSocket.ts`** — manages the WebSocket connection lifecycle.
- Connects to `NEXT_PUBLIC_WS_URL?token=TOKEN`
- Auto-reconnects on disconnect (exponential backoff)
- Exposes `sendMessage(message)` and the latest `lastMessage`

**`useChessGame.ts`** — the main game state machine.
- Handles all incoming WebSocket messages
- Maintains: board FEN, whose turn, player colors, game status, clock state
- `CLOCK_SYNC` handler: only applies server time if drift > 500ms
```typescript
case CLOCK_SYNC: {
  const { whiteTime: sWhite, blackTime: sBlack } = message.payload;
  setTimeState((prev) => {
    const whiteDrift = Math.abs(prev.whiteTime - sWhite);
    const blackDrift = Math.abs(prev.blackTime - sBlack);
    if (whiteDrift > 500 || blackDrift > 500) {
      return { whiteTime: sWhite, blackTime: sBlack };
    }
    return prev;
  });
  break;
}
```

### Key components

**`ChessBoard.tsx`** — renders the 8×8 board from `@repo/ui`. Handles piece click/drag to generate move payloads. Flips the board for black.

**`GameControls.tsx`** — shows game status, resign button, draw offer button, result message with rating changes.

### Theme system

Uses Tailwind CSS v4 with dark mode support. Dark mode is toggled via a class on the root element and persisted to `localStorage`.

### Sound system

A `useSound` hook plays audio on moves. The toggle state is persisted to `localStorage` so your preference survives page reloads.

---

## 12. Shared packages

### `@repo/types` (`packages/types`)

Exports all message type constants (`INIT_GAME`, `MOVE`, `GAME_OVER`, etc.) and TypeScript interfaces for every message. Both the server and client import from here — if you rename a message type or change a payload shape, TypeScript will immediately flag every place that uses it.

Also exports `TIME_CONTROLS` and `DEFAULT_TIME_CONTROL` — the single source of truth for time control configuration. Neither the server nor client hardcodes `300_000` anywhere.

### `@repo/db` (`packages/db`)

Exports the Prisma client. `packages/db/prisma/schema.prisma` is the database schema. After changing the schema, run:

```bash
cd packages/db
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

`prisma migrate dev` creates a new SQL migration file, applies it to the database, and runs `prisma generate`. `prisma generate` regenerates the TypeScript client from the schema.

### `@chess/chess-engine` (`packages/chess-engine`)

A thin wrapper around the `chess.js` library. Exposes:
- `createChess()` — creates a new game instance
- `tryMove({ from, to, promotion })` — attempt a move, returns the result or null if invalid
- `getBoard().fen()` — current board in FEN notation
- `getTurn()` — `'w'` or `'b'`
- `moveCount()` — total moves played
- `isGameOver()`, `isCheckmate()`, `isStalemate()` — game state queries
- `pgn()` — full game in PGN format

Wrapping chess.js in our own package means: if we ever want to swap the chess engine, we only change this package, not every file that uses it.

### `@repo/ui` (`packages/ui`)

React components shared between apps. Key component: `ChessBoard` — renders an interactive chess board. Takes FEN, valid moves, and callbacks for player interaction.

---

## 13. Docker and deployment

`docker-compose.yml` runs the full stack:

```yaml
services:
  web:     # Next.js frontend on port 3000
  ws-server: # WebSocket/HTTP server on port 8080
```

Both services are built from their respective `Dockerfile`s.

### Environment variables

**`apps/ws-server/.env`:**

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP/WS port (default 8080) |
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `DIRECT_URL` | Direct PostgreSQL connection (bypasses connection pooler for migrations) |
| `REDIS_URL` | Redis connection string (e.g., `redis://localhost:6379`) |
| `JWT_SECRET` | Secret key for signing JWT tokens — must be long and random in production |

**`apps/web/.env.local`:**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL (e.g., `ws://localhost:8080`) |

### Running locally

```bash
# Install all dependencies
pnpm install

# Start everything (runs both apps in parallel via Turborepo)
pnpm run dev

# Or start them individually:
cd apps/ws-server && pnpm run dev   # port 8080
cd apps/web && pnpm run dev         # port 3000
```

Make sure PostgreSQL and Redis are running before starting the server. Adjust `.env` files with your connection strings.

---

## 14. Design decisions explained

### Why WebSocket instead of HTTP polling?

Chess requires real-time bidirectional communication. HTTP polling (client asks server "anything new?" every second) adds 1s of latency on every move and wastes bandwidth. WebSocket keeps a persistent connection open — when the server has a message (a move, a clock tick), it pushes it immediately with no polling overhead.

### Why Redis instead of in-memory state only?

If we kept all game state in the Node.js process, two problems:
1. If the server crashes, all active games are lost.
2. We can't run multiple server instances (horizontal scaling), because a player on node 1 would have no idea about the game on node 2.

Redis solves both: state survives a restart, and multiple nodes share state through a common data store.

### Why is DB write fire-and-forget during gameplay?

During a move, we need two things to happen: Redis updated (so other services see the new state immediately), and a DB row created (for the permanent record). Redis is fast (microseconds). PostgreSQL is slower (milliseconds). If we awaited the DB write before acknowledging the move, players would feel lag on every move. Instead, Redis is the source of truth for live games. DB writes happen asynchronously and errors are logged. After the game ends, we await the DB update because at that point there's no more realtime pressure.

### Why bcrypt with 10 rounds?

bcrypt deliberately makes password hashing slow, which is the point. A fast hash function means an attacker who steals the database can try billions of passwords per second. bcrypt at 10 rounds means each hash takes ~100ms on modern hardware. That's fine for login (user waits 100ms) but makes bulk password cracking ~10 million times slower than SHA-256.

### Why are credentials in a separate table?

Single responsibility. `Profile` stores public user data. `Credentials` stores secrets. Any query that joins `Profile` to other tables (e.g., fetching a leaderboard) never accidentally includes password hashes in the result set.

### Why webcrypto for lobby codes instead of Math.random?

`Math.random()` is not cryptographically secure. Its output is predictable if an attacker knows the seed or observes enough values. A lobby code that's predictable means an attacker can guess your private game code and join your game. `webcrypto.getRandomValues()` uses the OS's entropy source and is unpredictable by design.

### Why Lua scripts for matchmaking and lobby pop?

Without atomicity, there are race conditions between server nodes:
- **Matchmaking**: Two nodes both see 2 players in the queue. Both run `RPOP` twice. All 4 pops succeed and the 2 players get matched with nobody (or each other on different nodes).
- **Lobby**: Two users both try to join the same code. Both read the creatorId before either deletes it. Both get a valid response and both games are created.

A Lua script on Redis runs as a single atomic operation. No other command can run on Redis between the GET and DEL, so the race condition is impossible.

### Why separate `client` and `subClient` Redis connections?

Once a Redis connection is in subscriber mode (after `SUBSCRIBE`), it can only send subscription commands. Trying to do a regular `GET` on it throws an error. So we always maintain two connections: one for regular commands, one locked in subscribe mode. This is standard practice with any Redis client library.

### Why not validate moves on the client?

We do client-side validation for UX (preventing obviously illegal moves from being sent), but the server re-validates every move independently using the same chess.js engine. The server is the authority. This prevents a modified client from sending illegal moves (cheating). If the server rejects a move, `INVALID_MOVE` is sent back and the client reverts the move.
