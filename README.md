# Chess Monorepo ♟️

A modern, real-time multiplayer chess application built with a high-performance stack. This monorepo leverages Turborepo for efficient build orchestration.

## 🏗 Architecture

The project is structured as a monorepo using **Turborepo** and **pnpm workspaces**:

### Apps
- **`apps/web`**: **Next.js 15+** frontend with **Tailwind CSS**. Handles the UI, game rendering, and user interactions.
- **`apps/api`**: **NestJS** backend service. Manages RESTful endpoints (if any) and potential future orchestrations.
- **`apps/ws-server`**: **Node.js** WebSocket server using `ws`. Handles real-time game state, moves, and player connections for low-latency performance.

### Packages
- **`packages/chess-engine`**: Core chess logic (wrapping `chess.js`) shared across frontend and backend.
- **`packages/shared-types`**: TypeScript interfaces and DTOs shared between all apps to ensure type safety.
- **`packages/ui`**: Shared UI component library.
- **`packages/config`**: Shared configurations (ESLint, Tailwind, TypeScript).

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v8+)
- [Docker](https://www.docker.com/) (optional, for containerized run)

### Local Development

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start all applications in development mode:**
    ```bash
    pnpm dev
    ```
    - Web: [http://localhost:3000](http://localhost:3000)
    - API: [http://localhost:3001](http://localhost:3001)
    - WS Server: `ws://localhost:8080`

### 🐳 Docker (Production Preview)

Run the entire stack with a single command:

```bash
docker-compose up --build
```

This will start:
- **Web App** on port `3000`
- **API Service** on port `3001` (mapped from 3000 inside container)
- **WS Server** on port `8080`

## 🛠 Build

To build all apps and packages:

```bash
pnpm run build
```

Turborepo will cache the build artifacts, making subsequent builds extremely fast.
