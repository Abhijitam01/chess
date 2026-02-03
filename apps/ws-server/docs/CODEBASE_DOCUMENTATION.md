# Chess Online - Complete Codebase Documentation

**Last Updated**: February 2026  
**Version**: 2.0 (Modern Turborepo Architecture)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Monorepo Structure](#monorepo-structure)
4. [Applications](#applications)
5. [Shared Packages](#shared-packages)
6. [Backend Deep Dive](#backend-deep-dive)
7. [Frontend Deep Dive](#frontend-deep-dive)
8. [Communication Protocol](#communication-protocol)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)
11. [Enhancement Opportunities](#enhancement-opportunities)

---

## Project Overview

**Chess Online** is a real-time multiplayer chess platform built as a modern **Turborepo monorepo** with shared packages and optimized build pipelines.

### Technology Stack

**Frontend**:
- **Next.js 16** (App Router) with Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **WebSocket** for real-time communication
- **chess.js** for move validation

**Backend**:
- **Node.js 20** with TypeScript
- **WebSocket Server** (ws library)
- **chess.js** for server-side validation

**Build & Dev Tools**:
- **Turborepo** for monorepo orchestration
- **pnpm** for package management
- **Docker** for containerization
- **ESLint** for code quality

### Core Features

✅ **Real-time multiplayer chess** with WebSocket communication  
✅ **Automatic matchmaking** (FIFO queue system)  
✅ **Move validation** on both client and server  
✅ **Game state synchronization** across connected clients  
✅ **Responsive UI** with modern design  
✅ **TypeScript** for type safety across the entire stack

---

## Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js on :3000)"
        A[Landing Page] --> B[Game Page]
        B --> C[useWebSocket Hook]
        B --> D[useChessGame Hook]
        B --> E[ChessBoard Component]
        B --> F[GameControls Component]
        
        E --> |@repo/ui| UI[Shared UI Package]
        C & D --> |@repo/types| Types[Shared Types] 
        D --> |@chess/chess-engine| Engine[Chess Engine]
    end

    subgraph "Backend (WebSocket :8080)"
        G[WebSocket Server] --> H[GameManager]
        H --> I[Pending Queue]
        H --> J[Active Games]
        J --> K[Game Instance 1]
        J --> L[Game Instance 2]
        K --> |chess.js| M[Chess Board]
    end

    C <--> |JSON over WebSocket| G

    style Frontend fill:#1e3a8a
    style Backend fill:#0f172a
```

---

## Monorepo Structure

```
chess-app/
├── apps/
│   ├── web/                    # Next.js frontend application
│   └── ws-server/              # WebSocket backend server
│
├── packages/
│   ├── api/                    # Legacy API package (unused)
│   ├── chess-engine/           # Chess.js wrapper (@chess/chess-engine)
│   ├── config/                 # Shared configuration
│   ├── eslint-config/          # Shared ESLint config
│   ├── types/                  # Shared TypeScript types (@repo/types)
│   ├── typescript-config/      # Shared TS configs
│   ├── ui/                     # Shared React components (@repo/ui)
│   └── utils/                  # Shared utilities (@repo/utils)
│
├── docker-compose.yml          # Docker orchestration
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── turbo.json                  # Turborepo pipeline configuration
└── tsconfig.base.json          # Base TypeScript configuration
```

###Workspace Dependencies

```mermaid
graph LR
    Web[apps/web] --> Types[@repo/types]
    Web --> UI[@repo/ui]
    Web --> Utils[@repo/utils]
    Web --> Engine[@chess/chess-engine]
    
    WS[apps/ws-server] --> Types
    WS --> Engine
    
    UI --> Types
    Engine --> Types
```

---

## Applications

### 1. `apps/web` - Next.js Frontend

**Purpose**: User-facing web application with real-time chess gameplay

**Key Directories**:
```
apps/web/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── game/
│   │   ├── page.tsx            # Quick match game page
│   │   └── [id]/page.tsx       # Room-based game page
│   └── spectate/[id]/page.tsx  # Spectator mode
│
├── components/
│   ├── ChessBoard.tsx          # Main chessboard UI
│   └── GameControls.tsx        # Game status & controls
│
├── hooks/
│   ├── useWebSocket.ts         # WebSocket connection management
│   └── useChessGame.ts         # Game state management
│
├── styles/
│   └── globals.css             # Global styles with Tailwind directives
│
└── public/                     # Static assets
```

**Port**: `3000` (development)

**Scripts**:
- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

---

### 2. `apps/ws-server` - WebSocket Backend

**Purpose**: WebSocket server handling game logic and matchmaking

**Key Files**:
```
apps/ws-server/src/
├── index.ts            # Main server entry point
├── GameManager.ts      # Matchmaking & game orchestration
├── game.ts             # Individual game logic
├── messages.ts         # Message type constants (legacy)
├── config.ts           # Server configuration
├── handlers/           # Message handlers
└── services/           # Business logic services
```

**Port**: `8080`

**Scripts**:
- `pnpm run dev` - Start development server with hot reload (tsx watch)
- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run start` - Start production server

---

## Shared Packages

### `@repo/types`

**Purpose**: Shared TypeScript type definitions for client-server communication

**Key Types**:
```typescript
// Message Types
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

// Client → Server
export interface ClientMessage {
  type: typeof INIT_GAME | typeof MOVE;
  move?: MovePayload;
}

export interface MovePayload {
  from: string;  // e.g., "e2"
  to: string;    // e.g., "e4"
}

// Server → Client
export interface ServerMessage {
  type: typeof INIT_GAME | typeof MOVE | typeof GAME_OVER;
  payload: any;
}
```

---

### `@chess/chess-engine`

**Purpose**: Wrapper around chess.js library for consistent usage

**API**:
```typescript
import { createChess } from '@chess/chess-engine';

const chess = createChess();
chess.move({ from: 'e2', to: 'e4' });
chess.fen();           // Get board state
chess.turn();          // Returns 'w' or 'b'
chess.isGameOver();
chess.isCheckmate();
```

**Why**: Centralizes chess.js configuration and provides consistent API across frontend/backend

---

### `@repo/ui`

**Purpose**: Shared React components with Tailwind styling

**Components**:
- `ChessBoard` - Interactive chessboard with drag-and-drop
- `Button` - Styled button with variants
- *(More components as needed)*

**Usage**:
```tsx
import { ChessBoard } from '@repo/ui';

<ChessBoard
  chess={chessInstance}
  playerColor="white"
  isMyTurn={true}
  onMove={(from, to) => makeMove(from, to)}
/>
```

---

### `@repo/utils`

**Purpose**: Shared utility functions

**Functions**:
- String manipulation
- Date formatting
- Validation helpers

---

## Backend Deep Dive

### File: `apps/ws-server/src/index.ts`

**Purpose**: WebSocket server initialization

```typescript
import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port });

const gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  gameManager.addUserToGame(ws);

  ws.on("close", () => {
    gameManager.removeUserFromGame(ws);
  });
});

console.log(`WebSocket server listening on port ${port}`);
```

**Key Points**:
- Creates single `GameManager` instance (singleton pattern)
- Delegates connection lifecycle to `GameManager`
- Listens on port 8080 (configurable via env var)

---

### File: `apps/ws-server/src/GameManager.ts`

**Purpose**: Matchmaking logic and message routing

```typescript
export class GameManager {
  private games: Game[] = [];
  private pendingUser: WebSocket | null = null;
  private users: WebSocket[] = [];
```

**State Management**:
- `games[]` - Array of active Game instances
- `pendingUser` - First player waiting for opponent (simple FIFO queue)
- `users[]` - All connected WebSocket clients

**Key Methods**:

#### `addUserToGame(socket: WebSocket)`
```typescript
addUserToGame(socket: WebSocket) {
  console.log("User added to GameManager");
  this.users.push(socket);
  this.addHandler(socket);
}
```
- Adds socket to users array
- Attaches message handler

#### `removeUserFromGame(socket: WebSocket)`
```typescript
removeUserFromGame(socket: WebSocket) {
  console.log("User removed from GameManager");
  this.users = this.users.filter((user) => user !== socket);
}
```
- Filters out disconnected user
- **⚠️ Limitation**: Doesn't handle game abandonment

#### `addHandler(socket: WebSocket)` (Private)

Handles two message types:

**1. INIT_GAME** - Matchmaking:
```typescript
if (message.type === INIT_GAME) {
  if (this.pendingUser) {
    // Match found! Create game with both players
    const game = new Game(this.pendingUser, socket);
    this.games.push(game);
    this.pendingUser = null;
  } else {
    // First player, add to queue
    this.pendingUser = socket;
  }
}
```

**2. MOVE** - Move routing:
```typescript
if (message.type === MOVE) {
  const game = this.games.find(
    (game) => game.player1 === socket || game.player2 === socket
  );
  if (game) {
    game.makeMove(socket, message.move);
  }
}
```

---

### File: `apps/ws-server/src/game.ts`

**Purpose**: Individual chess game instance

```typescript
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: number;
```

**Constructor**:
```typescript
constructor(player1: WebSocket, player2: WebSocket) {
  this.player1 = player1;
  this.player2 = player2;
  this.board = new Chess();
  this.startTime = Date.now();

  // Notify players of their colors
  this.player1.send(JSON.stringify({
    type: INIT_GAME,
    payload: { color: "white" }
  }));
  
  this.player2.send(JSON.stringify({
    type: INIT_GAME,
    payload: { color: "black" }
  }));
}
```

**Key Method: `makeMove(socket: WebSocket, move: MovePayload)`**

1. **Turn Validation**:
```typescript
if (this.board.turn() === 'w' && socket !== this.player1) return;
if (this.board.turn() === 'b' && socket !== this.player2) return;
```

2. **Move Validation** (via chess.js):
```typescript
try {
  this.board.move(move);
} catch (error) {
  console.log("Invalid move", error);
  return;
}
```

3. **Game Over Check**:
```typescript
if (this.board.isGameOver()) {
  const winner = this.board.turn() === "w" ? "black" : "white";
  // Notify both players
  this.player1.send(JSON.stringify({
    type: GAME_OVER,
    payload: { winner }
  }));
  this.player2.send(JSON.stringify({
    type: GAME_OVER,
    payload: { winner }
  }));
  return;
}
```

4. **Broadcast Move**:
```typescript
const moveMsg = JSON.stringify({
  type: MOVE,
  payload: move
});

this.player1.send(moveMsg);
this.player2.send(moveMsg);
```

---

## Frontend Deep Dive

### File: `apps/web/app/game/page.tsx`

**Purpose**: Quick match game page

```tsx
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function Game() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, makeMove, isMyTurn } = 
    useChessGame(socket, isConnected);

  const handleStartGame = () => {
    sendMessage({ type: "init_game" });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav>{/* ... */}</nav>

      {/* Game Layout */}
      <div className="flex gap-8">
        {/* Chess Board */}
        <ChessBoard
          chess={chess}
          playerColor={playerColor}
          isMyTurn={isMyTurn}
          onMove={makeMove}
        />

        {/* Game Controls */}
        <GameControls
          status={status}
          playerColor={playerColor}
          isConnected={isConnected}
          onStartGame={handleStartGame}
          winner={winner}
        />
      </div>
    </div>
  );
}
```

**Key Features**:
- Uses custom hooks for separation of concerns
- Responsive layout (stacks vertically on mobile)
- Environment-based WebSocket URL

---

### File: `apps/web/hooks/useWebSocket.ts`

**Purpose**: WebSocket connection management with auto-reconnect

**Key Features**:

1. **Connection Management**:
```typescript
const [socket, setSocket] = useState<WebSocket | null>(null);
const [isConnected, setIsConnected] = useState(false);
```

2. **Auto-Reconnect** (3-second delay):
```typescript
ws.onclose = () => {
  setIsConnected(false);
  setSocket(null);

  reconnectTimeoutRef.current = setTimeout(() => {
    connectWebSocket();
  }, 3000);
};
```

3. **Message Sender**:
```typescript
const sendMessage = (message: unknown) => {
  if (socket && isConnected) {
    socket.send(JSON.stringify(message));
  }
};
```

4. **Cleanup**:
```typescript
return () => {
  if (reconnectTimeoutRef.current) {
    clearTimeout(reconnectTimeoutRef.current);
  }
  ws.close();
};
```

---

### File: `apps/web/hooks/useChessGame.ts`

**Purpose**: Game state management and message handling

**State**:
```typescript
interface GameState {
  chess: ReturnType<typeof createChess>;
  playerColor: "white" | "black" | null;
  status: "waiting" | "playing" | "finished";
  turn: "w" | "b";
  winner: string | null;
}
```

**Message Handling**:

1. **INIT_GAME** - Assigns player color:
```typescript
case "init_game":
  setGameState(prev => ({
    ...prev,
    playerColor: message.payload.color,
    status: "playing"
  }));
```

2. **MOVE** - Applies opponent's move:
```typescript
case "move":
  setGameState(prev => {
    const newChess = createChess();
    newChess.load(prev.chess.fen());
    
    const moveResult = newChess.move({
      from: payload.from,
      to: payload.to,
      promotion: 'q'
    });
    
    return moveResult ? {
      ...prev,
      chess: newChess,
      turn: newChess.turn()
    } : prev;
  });
```

3. **GAME_OVER** - Marks game as finished:
```typescript
case "game_over":
  setGameState(prev => ({
    ...prev,
    status: "finished",
    winner: message.payload.winner
  }));
```

**Move Function**:
```typescript
const makeMove = (from: string, to: string) => {
  const move = gameState.chess.move({ from, to, promotion: "q" });

  if (move && socket && isConnected) {
    socket.send(JSON.stringify({
      type: "move",
      move: { from, to }
    }));
    return true;
  }

  return false;
};
```

---

### Components

#### `components/ChessBoard.tsx`

**Props**:
```typescript
interface ChessBoardProps {
  chess: ChessInstance;
  playerColor: "white" | "black" | null;
  isMyTurn: boolean;
  onMove: (from: string, to: string) => boolean;
}
```

**Features**:
- 8×8 grid layout with alternating colors
- Chess piece rendering using Unicode symbols
- Click-to-move interaction
- Valid move highlighting
- Square coordinates (a-h, 1-8)
- Board flips based on player color
- Gradient backgrounds and modern styling

**Styling**:
- Tailwind CSS with custom gradients
- Responsive sizing (max-w-2xl)
- Shadow and depth effects
- Smooth transitions

---

## Communication Protocol

### Client → Server Messages

#### 1. Init Game
```json
{
  "type": "init_game"
}
```
**Trigger**: Player clicks "Start Game"  
**Response**: Server assigns color and starts game when paired

#### 2. Move
```json
{
  "type": "move",
  "move": {
    "from": "e2",
    "to": "e4"
  }
}
```
**Trigger**: Player makes a move  
**Validation**: Server validates before broadcasting

---

### Server → Client Messages

#### 1. Init Game
```json
{
  "type": "init_game",
  "payload": {
    "color": "white"
  }
}
```
**Trigger**: Game starts (both players matched)

#### 2. Move
```json
{
  "type": "move",
  "payload": {
    "from": "e7",
    "to": "e5"
  }
}
```
**Trigger**: Valid move made by either player  
**Sent to**: Both players

#### 3. Game Over
```json
{
  "type": "game_over",
  "payload": {
    "winner": "white"
  }
}
```
**Trigger**: Checkmate, stalemate, or resignation  
**Contains**: Winner color

---

## Development Workflow

### Local Development

**1. Install Dependencies**:
```bash
pnpm install
```

**2. Start Development Servers**:

Terminal 1 - WebSocket Server:
```bash
cd apps/ws-server && pnpm run dev
```

Terminal 2 - Next.js Frontend:
```bash
cd apps/web && pnpm run dev
```

**3. Access Application**:
- Frontend: `http://localhost:3000`
- WebSocket: `ws://localhost:8080`

---

### Building for Production

```bash
# Build all apps
pnpm run build

# Or build specific app
cd apps/web && pnpm run build
cd apps/ws-server && pnpm run build
```

---

## Deployment

### Docker

**Build and Run**:
```bash
docker-compose up --build
```

**Services**:
- `web` - Next.js on port 3000
- `ws-server` - WebSocket on port 8080

**Note**: Docker Compose v1.x has compatibility issues. Use v2+ or dev servers.

---

### Environment Variables

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
```

**Backend** (`apps/ws-server/.env`):
```env
PORT=8080
```

---

## Enhancement Opportunities

### Backend

1. **Player Disconnection Handling**
   - Pause game on disconnect
   - Allow reconnection with session ID
   - Auto-resign after timeout

2. **Room System**
   - Private rooms with codes
   - Spectator mode
   - Game history/replays

3. **Matchmaking Improvements**
   - ELO rating system
   - Skill-based matching
   - Time control preferences

4. **Persistence**
   - Database integration (PostgreSQL/MongoDB)
   - Game history storage
   - User profiles

5. **Move Validation**
   - Notify players of invalid moves
   - Send detailed error messages

6. **Time Controls**
   - Implement chess clocks
   - Increment/delay modes
   - Time-out handling

---

### Frontend

1. **UI Enhancements**
   - Move history panel
   - Captured pieces display
   - Game timer display
   - Premove support

2. **User Features**
   - User authentication
   - Profile pages
   - Match history
   - Statistics dashboard

3. **Game Features**
   - Draw offers
   - Resignation
   - Undo requests
   - Chat system

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode

5. **Performance**
   - Lazy loading
   - Code splitting
   - Image optimization

---

### Shared Packages

1. **Type Safety**
   - Use Zod for runtime validation
   - Stricter message types
   - Type guards

2. **Testing**
   - Unit tests for chess-engine
   - Integration tests for WebSocket
   - E2E tests with Playwright

3. **Documentation**
   - API documentation
   - Component storybook
   - Architecture diagrams

---

## Known Issues

1. **CSS Classes Not Applying**: Some Tailwind classes may not apply in Turbopack dev mode. Run production build to verify.

2. **Docker Compose v1 Compatibility**: Older docker-compose versions may fail. Use docker-compose v2+ or development servers.

3. **WebSocket Reconnection**: Infinite reconnect loop if server is down. Should implement max retry limit.

4. **Game Abandonment**: If player disconnects mid-game, the game becomes broken. Needs proper cleanup.

---

## Additional Resources

- [Chess.js Documentation](https://github.com/jhlywa/chess.js)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Last Updated**: February 4, 2026  
**Maintainer**: Development Team  
**Version**: 2.0
