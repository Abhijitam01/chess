import { describe, it, expect, vi, afterEach } from "vitest";
import { Game } from "../game.js";
import type { DatabaseService } from "../services/DatabaseService.js";
import type { RedisService } from "../services/RedisService.js";

// ── Top-level mocks ───────────────────────────────────────────────────────────

vi.mock("../config.js", () => ({
  config: {
    redisUrl: "redis://localhost:6379",
    port: 8080,
    jwtSecret: "test-secret",
    jwtExpiresIn: "7d",
    bcryptRounds: 1,
  },
}));

vi.mock("@repo/db", () => ({ prisma: {} }));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMockSocket() {
  const sent: string[] = [];
  return {
    readyState: 1 as const,
    send: vi.fn((data: string) => sent.push(data)),
    close: vi.fn(),
    on: vi.fn(),
    sent,
  };
}

function makeStubDb(overrides?: Partial<DatabaseService>): DatabaseService {
  return {
    getProfileById: vi.fn().mockResolvedValue({ rating: 1200 }),
    createGame: vi.fn().mockResolvedValue({ id: "game-123" }),
    saveMove: vi.fn().mockResolvedValue(undefined),
    updateGame: vi.fn().mockResolvedValue(undefined),
    updateProfileStats: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as DatabaseService;
}

function makeStubRedis(): RedisService {
  return {
    initGame: vi.fn().mockResolvedValue(undefined),
    publishMove: vi.fn().mockResolvedValue(undefined),
    finishGame: vi.fn().mockResolvedValue(undefined),
  } as unknown as RedisService;
}

/** Create a Game and wait for async initialization to complete. */
async function createInitializedGame(
  dbOverrides?: Partial<DatabaseService>,
  onReady?: (id: string) => void,
) {
  const p1 = makeMockSocket();
  const p2 = makeMockSocket();
  const db = makeStubDb(dbOverrides);
  const redis = makeStubRedis();

  const game = new Game(
    p1 as never,
    p2 as never,
    "white-id",
    "black-id",
    db,
    redis,
    onReady,
  );

  // Wait for async initializeGame to complete
  await vi.waitFor(() => {
    if (game.getGameId() === undefined && !(dbOverrides?.createGame)) {
      throw new Error("not ready");
    }
  }, { timeout: 2000 });

  return { game, p1, p2, db, redis };
}

// Track active games so we can stop clocks after each test
const activeGames: Game[] = [];

afterEach(() => {
  for (const g of activeGames) {
    if (!g.isFinished()) g.resign(g.player1 as never);
  }
  activeGames.length = 0;
});

async function makeGame(dbOverrides?: Partial<DatabaseService>, onReady?: (id: string) => void) {
  const result = await createInitializedGame(dbOverrides, onReady);
  activeGames.push(result.game);
  return result;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Game initialization", () => {
  it("calls onReady with the new gameId after DB record is created", async () => {
    const onReady = vi.fn();
    const { game } = await makeGame(undefined, onReady);
    expect(onReady).toHaveBeenCalledWith("game-123");
    expect(game.getGameId()).toBe("game-123");
  });

  it("sends INIT_GAME to both players with correct colors", async () => {
    const { p1, p2 } = await makeGame();
    const whiteMsg = JSON.parse(p1.sent.find((m) => m.includes("init_game")) ?? "{}");
    const blackMsg = JSON.parse(p2.sent.find((m) => m.includes("init_game")) ?? "{}");

    expect(whiteMsg.payload.color).toBe("white");
    expect(blackMsg.payload.color).toBe("black");
    expect(whiteMsg.payload.gameId).toBe("game-123");
  });

  it("initialises Redis game state after creation", async () => {
    const { redis } = await makeGame();
    expect(redis.initGame).toHaveBeenCalledWith(
      "game-123",
      "white-id",
      "black-id",
      expect.any(String),
      300000,
      300000,
    );
  });

  it("survives a DB failure in createGame — game stays alive but uninitialized", async () => {
    const p1 = makeMockSocket();
    const p2 = makeMockSocket();
    const db = makeStubDb({ createGame: vi.fn().mockRejectedValue(new Error("DB down")) });
    const redis = makeStubRedis();
    const game = new Game(p1 as never, p2 as never, "w", "b", db, redis);
    activeGames.push(game);
    // Give the async error path a tick to settle
    await new Promise((r) => setTimeout(r, 50));
    expect(game.isFinished()).toBe(false);
    expect(game.getGameId()).toBeUndefined();
  });
});

describe("Game.makeMove", () => {
  it("accepts a legal move and broadcasts it to both players", async () => {
    const { game, p1, p2 } = await makeGame();
    const prevP1 = p1.sent.length;
    const prevP2 = p2.sent.length;

    await game.makeMove(p1 as never, { from: "e2", to: "e4" });

    const p1Moves = p1.sent.slice(prevP1).map((m) => JSON.parse(m));
    const p2Moves = p2.sent.slice(prevP2).map((m) => JSON.parse(m));

    expect(p1Moves.find((m) => m.type === "move")?.payload.from).toBe("e2");
    expect(p2Moves.find((m) => m.type === "move")).toBeDefined();
  });

  it("rejects a move played out of turn", async () => {
    const { game, p2 } = await makeGame();
    const prevCount = p2.sent.length;

    await game.makeMove(p2 as never, { from: "e7", to: "e5" });

    expect(p2.sent.length).toBe(prevCount);
  });

  it("sends INVALID_MOVE for an illegal move", async () => {
    const { game, p1 } = await makeGame();
    const prevCount = p1.sent.length;

    await game.makeMove(p1 as never, { from: "e2", to: "e9" }); // off-board

    const newMsgs = p1.sent.slice(prevCount).map((m) => JSON.parse(m));
    expect(newMsgs.find((m) => m.type === "invalid_move")).toBeDefined();
  });

  it("ignores moves after the game is finished", async () => {
    const { game, p1 } = await makeGame();
    game.resign(p1 as never); // ends game
    const prevCount = p1.sent.length;

    await game.makeMove(p1 as never, { from: "e2", to: "e4" });

    expect(p1.sent.length).toBe(prevCount);
  });

  it("publishes move to Redis", async () => {
    const { game, p1, redis } = await makeGame();
    await game.makeMove(p1 as never, { from: "e2", to: "e4" });
    expect(redis.publishMove).toHaveBeenCalled();
  });
});

describe("Game.resign", () => {
  it("black wins when white resigns", async () => {
    const { game, p1, p2 } = await makeGame();
    game.resign(p1 as never);

    const msgs = [...p1.sent, ...p2.sent]
      .map((m) => JSON.parse(m))
      .filter((m) => m.type === "game_over");

    expect(msgs[0]?.payload.winner).toBe("black");
    expect(msgs[0]?.payload.reason).toBe("resignation");
    expect(game.isFinished()).toBe(true);
  });

  it("white wins when black resigns", async () => {
    const { game, p1, p2 } = await makeGame();
    game.resign(p2 as never);

    const msgs = [...p1.sent, ...p2.sent]
      .map((m) => JSON.parse(m))
      .filter((m) => m.type === "game_over");

    expect(msgs[0]?.payload.winner).toBe("white");
  });

  it("is a no-op when called twice", async () => {
    const { game, p1 } = await makeGame();
    game.resign(p1 as never);
    const afterFirst = p1.sent.length;
    game.resign(p1 as never);
    expect(p1.sent.length).toBe(afterFirst);
  });
});

describe("Game draw offer / accept / decline", () => {
  it("sends DRAW_OFFER to opponent", async () => {
    const { game, p1, p2 } = await makeGame();
    const prevP2 = p2.sent.length;

    game.offerDraw(p1 as never);

    const newMsgs = p2.sent.slice(prevP2).map((m) => JSON.parse(m));
    expect(newMsgs.find((m) => m.type === "draw_offer")).toBeDefined();
  });

  it("ends the game as draw when opponent accepts", async () => {
    const { game, p1, p2 } = await makeGame();
    game.offerDraw(p1 as never);
    await game.respondDraw(p2 as never, true);

    const msgs = [...p1.sent, ...p2.sent]
      .map((m) => JSON.parse(m))
      .filter((m) => m.type === "game_over");

    expect(msgs[0]?.payload.winner).toBeNull();
    expect(msgs[0]?.payload.reason).toBe("agreement");
    expect(game.isFinished()).toBe(true);
  });

  it("sends DRAW_DECLINE to offerer when declined", async () => {
    const { game, p1, p2 } = await makeGame();
    game.offerDraw(p1 as never);
    const prevP1 = p1.sent.length;

    await game.respondDraw(p2 as never, false);

    const newMsgs = p1.sent.slice(prevP1).map((m) => JSON.parse(m));
    expect(newMsgs.find((m) => m.type === "draw_decline")).toBeDefined();
    expect(game.isFinished()).toBe(false);
  });

  it("ignores a second draw offer while one is pending", async () => {
    const { game, p1, p2 } = await makeGame();
    game.offerDraw(p1 as never);
    const prevP2 = p2.sent.length;
    game.offerDraw(p2 as never); // blocked — p1's offer is still pending
    expect(p2.sent.length).toBe(prevP2);
  });

  it("ignores a response from the same player who offered", async () => {
    const { game, p1 } = await makeGame();
    game.offerDraw(p1 as never);
    await game.respondDraw(p1 as never, true); // offerer accepting own offer — invalid
    expect(game.isFinished()).toBe(false);
  });
});

describe("Game.reconnectPlayer", () => {
  it("updates the socket and sends current board state", async () => {
    const { game } = await makeGame();
    const newSocket = makeMockSocket();

    game.reconnectPlayer(newSocket as never, "white-id");

    expect(game.player1).toBe(newSocket);
    const initMsg = JSON.parse(newSocket.sent[0] ?? "{}");
    expect(initMsg.type).toBe("init_game");
    expect(initMsg.payload.resumed).toBe(true);
    expect(initMsg.payload.color).toBe("white");
  });

  it("updates black's socket when black reconnects", async () => {
    const { game } = await makeGame();
    const newSocket = makeMockSocket();

    game.reconnectPlayer(newSocket as never, "black-id");

    expect(game.player2).toBe(newSocket);
    const initMsg = JSON.parse(newSocket.sent[0] ?? "{}");
    expect(initMsg.payload.color).toBe("black");
  });
});
