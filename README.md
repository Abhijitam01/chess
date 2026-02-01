# Chess Online - Real-Time Multiplayer Chess

A real-time multiplayer chess application built with WebSocket technology, allowing players to compete against each other from anywhere in the world.

## 🎯 Features

- ✅ Real-time multiplayer gameplay
- ✅ Automatic matchmaking (FIFO queue)
- ✅ Complete chess rules validation
- ✅ Interactive chess board with move highlighting
- ✅ Responsive design (mobile & desktop)
- ✅ Auto-reconnection on disconnect
- ✅ Modern UI with dark theme

## 🏗️ Architecture

```
chess/
├── backend1/          # WebSocket server (Node.js + TypeScript)
├── frontend/          # React app (Vite + TailwindCSS)
└── docs/             # Documentation
```

**Tech Stack:**

- **Backend**: Node.js, WebSocket (ws), chess.js, TypeScript
- **Frontend**: React 19, Vite, TailwindCSS, TypeScript, chess.js
- **Communication**: WebSocket with JSON messages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd chess
```

2. **Start Backend**

```bash
cd backend1
npm install
npm run build
node dist/index.js
```

Backend runs on `ws://localhost:8080`

3. **Start Frontend** (in new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

4. **Play!**

- Open two browser windows
- Click "Play Now" in both
- Click "Start Game" in both windows
- You'll be matched automatically!

## 🎮 How to Play

1. Navigate to the landing page
2. Click "Play Now" to enter the game page
3. Click "Start Game" to join the matchmaking queue
4. Once matched with an opponent, the game begins
5. Click a piece to select it, then click a destination square to move
6. Game ends on checkmate, stalemate, or draw

## 📚 Documentation

Comprehensive documentation is available in [`docs/CODEBASE_DOCUMENTATION.md`](./docs/CODEBASE_DOCUMENTATION.md), covering:

- Complete architecture breakdown
- Every file explained block-by-block
- Backend-frontend communication protocol
- Enhancement opportunities
- Scaling strategies
- Security considerations
- Testing strategies
- Deployment guides

## 🔧 Development

### Backend Development

```bash
cd backend1
npm run dev  
```

### Frontend Development

```bash
cd frontend
npm run dev
```

## 🚀 Roadmap

### Immediate Priorities

1. Fix player disconnection bugs
2. Add error handling and notifications
3. Implement move history display
4. Add sound effects
5. Environment variable configuration

### Planned Features

- User authentication and accounts
- ELO rating system
- Game history and replay
- Time controls (chess clock)
- Chat functionality
- Spectator mode
- Tournament support

See full roadmap in documentation.

## 📦 Project Structure

```
chess/
├── backend1/
│   ├── src/
│   │   ├── index.ts           # WebSocket server entry
│   │   ├── GameManager.ts     # Matchmaking logic
│   │   ├── game.ts            # Chess game logic
│   │   └── messages.ts        # Message constants
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Landing.tsx    # Landing page
│   │   │   └── game.tsx       # Game page
│   │   ├── components/
│   │   │   ├── ChessBoard.tsx # Interactive board
│   │   │   └── GameControls.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   └── useChessGame.ts
│   │   └── main.tsx
│   └── package.json



## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic library
- [ws](https://github.com/websockets/ws) - WebSocket library
- React, Vite, TailwindCSS teams

---

