# Mermaid-Only Architecture Diagrams (apps/web)

Diagram set covers the full app flow from landing to gameplay and updates.

```mermaid
graph TD
  A[User] --> B[Landing Page /]
  B --> C[CTA: Play Now]
  C --> D[/game Route]
  D --> E[Game Page Component]
  E --> F[useWebSocket]
  E --> G[useChessGame]
  G --> H[Chess Engine @chess/chess-engine]
  F --> I[(WebSocket Server)]
  E --> J[ChessBoard]
  E --> K[GameControls]
  E --> L[MoveHistory]
  E --> M[ChessClock]
  E --> N[Sidebar]
  J --> O[ChessPiece]
  G --> J
  G --> K
  G --> L
  G --> M
  P[/spectate/:id] --> Q[Spectate Stub]
```

```mermaid
sequenceDiagram
  participant User as User
  participant UI as Game UI
  participant Board as ChessBoard
  participant Hook as useChessGame
  participant WS as WebSocket
  participant Server as Game Server
  User->>UI: Open /game
  UI->>WS: Connect (NEXT_PUBLIC_WS_URL)
  User->>UI: Click Find Opponent
  UI->>WS: send init_game
  WS->>Server: init_game
  Server-->>WS: init_game payload (color)
  WS-->>Hook: init_game
  User->>Board: Select piece and target square
  Board->>Hook: onMove(from,to)
  Hook->>Hook: Validate with local engine
  Hook->>WS: send move
  WS->>Server: move
  Server-->>WS: move (san, from, to, promotion)
  WS-->>Hook: move
  Hook->>UI: Update board, history, turn
  Server-->>WS: time_update
  WS-->>Hook: time_update
  Hook->>UI: Update clocks
  Server-->>WS: game_over
  WS-->>Hook: game_over
  Hook->>UI: Show winner
```

```mermaid
stateDiagram-v2
  [*] --> waiting
  waiting --> playing: init_game
  playing --> finished: game_over
  playing --> finished: opponent_left
  finished --> waiting: resetGame or reload
```

```mermaid
flowchart LR
  subgraph Client
    A1[Landing Page]
    A2[Game Page]
    A3[useWebSocket]
    A4[useChessGame]
    A5[ChessBoard]
    A6[MoveHistory]
    A7[GameControls]
    A8[ChessClock]
    A9[Sidebar]
  end
  subgraph Server
    B1[WebSocket Server]
  end
  A2 --> A3
  A2 --> A4
  A4 --> A5
  A4 --> A6
  A4 --> A7
  A4 --> A8
  A3 <--> B1
```

