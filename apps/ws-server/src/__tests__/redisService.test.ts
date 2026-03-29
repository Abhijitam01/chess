import { describe, it, expect, vi, beforeEach } from "vitest";

// ── vi.hoisted ensures these are available before vi.mock factories run ───────

const mocks = vi.hoisted(() => {
  const mockOn = vi.fn();
  const mockConnect = vi.fn().mockResolvedValue(undefined);
  const mockQuit = vi.fn().mockResolvedValue(undefined);
  const mockGet = vi.fn();
  const mockSet = vi.fn().mockResolvedValue("OK");
  const mockDel = vi.fn().mockResolvedValue(1);
  const mockSadd = vi.fn().mockResolvedValue(1);
  const mockSrem = vi.fn().mockResolvedValue(1);
  const mockSmembers = vi.fn().mockResolvedValue([]);
  const mockLrange = vi.fn().mockResolvedValue([]);
  const mockRpush = vi.fn().mockResolvedValue(1);
  const mockExpire = vi.fn().mockResolvedValue(1);
  const mockPublish = vi.fn().mockResolvedValue(1);
  const mockSubscribe = vi.fn().mockResolvedValue(undefined);
  const mockUnsubscribe = vi.fn().mockResolvedValue(undefined);
  const mockLrem = vi.fn().mockResolvedValue(0);
  const mockLpush = vi.fn().mockResolvedValue(1);
  const mockEval = vi.fn();
  return {
    mockOn, mockConnect, mockQuit, mockGet, mockSet, mockDel,
    mockSadd, mockSrem, mockSmembers, mockLrange, mockRpush,
    mockExpire, mockPublish, mockSubscribe, mockUnsubscribe,
    mockLrem, mockLpush, mockEval,
  };
});

vi.mock("ioredis", () => {
  class Redis {
    on = mocks.mockOn;
    connect = mocks.mockConnect;
    quit = mocks.mockQuit;
    get = mocks.mockGet;
    set = mocks.mockSet;
    del = mocks.mockDel;
    sadd = mocks.mockSadd;
    srem = mocks.mockSrem;
    smembers = mocks.mockSmembers;
    lrange = mocks.mockLrange;
    rpush = mocks.mockRpush;
    expire = mocks.mockExpire;
    publish = mocks.mockPublish;
    subscribe = mocks.mockSubscribe;
    unsubscribe = mocks.mockUnsubscribe;
    lrem = mocks.mockLrem;
    lpush = mocks.mockLpush;
    eval = mocks.mockEval;
  }
  return { default: Redis };
});

vi.mock("../config.js", () => ({
  config: {
    redisUrl: "redis://localhost:6379",
    port: 8080,
    jwtSecret: "test-secret",
    jwtExpiresIn: "7d",
    bcryptRounds: 1,
  },
}));

import { RedisService } from "../services/RedisService.js";

// ── Helper: capture the 'message' dispatcher registered on the sub-client ────

function captureMessageDispatcher(): (channel: string, raw: string) => void {
  const call = mocks.mockOn.mock.calls.find(([event]) => event === "message");
  if (!call) throw new Error("No 'message' listener registered on sub-client");
  return call[1] as (channel: string, raw: string) => void;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("RedisService.initGame", () => {
  let svc: RedisService;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
  });

  it("writes game state, user active-game keys, and adds to active set", async () => {
    await svc.initGame("g1", "white1", "black1", "rnbqkbnr/pppppppp/...", 300000, 300000);

    expect(mocks.mockSet).toHaveBeenCalledWith(
      "game:g1:state",
      expect.stringContaining('"fen"'),
      "EX",
      86400,
    );
    expect(mocks.mockSet).toHaveBeenCalledWith("user:white1:activeGame", "g1", "EX", 86400);
    expect(mocks.mockSet).toHaveBeenCalledWith("user:black1:activeGame", "g1", "EX", 86400);
    expect(mocks.mockSadd).toHaveBeenCalledWith("active_games", "g1");
  });
});

describe("RedisService.finishGame", () => {
  let svc: RedisService;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
  });

  it("deletes active-game keys and removes from active set", async () => {
    mocks.mockGet.mockResolvedValueOnce(
      JSON.stringify({ fen: "...", whiteTime: 0, blackTime: 0, turn: "w", status: "active", whitePlayerId: "w", blackPlayerId: "b" }),
    );
    await svc.finishGame("g1", "white1", "black1");

    expect(mocks.mockDel).toHaveBeenCalledWith("user:white1:activeGame");
    expect(mocks.mockDel).toHaveBeenCalledWith("user:black1:activeGame");
    expect(mocks.mockSrem).toHaveBeenCalledWith("active_games", "g1");
  });
});

describe("RedisService.tryDequeueMatchedPair", () => {
  let svc: RedisService;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
  });

  it("returns null when eval returns null", async () => {
    mocks.mockEval.mockResolvedValueOnce(null);
    expect(await svc.tryDequeueMatchedPair()).toBeNull();
  });

  it("returns [userA, userB] when eval returns a pair", async () => {
    mocks.mockEval.mockResolvedValueOnce(["alice", "bob"]);
    expect(await svc.tryDequeueMatchedPair()).toEqual(["alice", "bob"]);
  });

  it("returns null when eval returns an empty array", async () => {
    mocks.mockEval.mockResolvedValueOnce([]);
    expect(await svc.tryDequeueMatchedPair()).toBeNull();
  });
});

describe("RedisService.enqueueForMatchmaking", () => {
  let svc: RedisService;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
  });

  it("removes stale entry then pushes to front of queue", async () => {
    await svc.enqueueForMatchmaking("alice");
    expect(mocks.mockLrem).toHaveBeenCalledWith("matchmaking:queue", 0, "alice");
    expect(mocks.mockLpush).toHaveBeenCalledWith("matchmaking:queue", "alice");
  });
});

describe("RedisService pub/sub channel management", () => {
  let svc: RedisService;
  let dispatch: (channel: string, raw: string) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
    dispatch = captureMessageDispatcher();
  });

  it("routes messages to the correct channel handler", () => {
    const handler = vi.fn();
    svc.subscribeToUserNotify("alice", handler);

    dispatch(
      "user:alice:notify",
      JSON.stringify({ type: "match_found", gameId: "g1", color: "white", opponentId: "bob", timeControl: { whiteTime: 300000, blackTime: 300000 } }),
    );

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: "match_found", gameId: "g1" }));
  });

  it("does not call handler after unsubscription", () => {
    const handler = vi.fn();
    svc.subscribeToUserNotify("alice", handler);
    svc.unsubscribeFromUserNotify("alice");

    dispatch("user:alice:notify", JSON.stringify({ type: "match_found" }));

    expect(handler).not.toHaveBeenCalled();
  });

  it("silently ignores malformed messages without throwing", () => {
    const handler = vi.fn();
    svc.subscribeToUserNotify("alice", handler);
    expect(() => dispatch("user:alice:notify", "{bad json")).not.toThrow();
  });

  it("routes live game events to subscribeToGame callback", () => {
    const handler = vi.fn();
    svc.subscribeToGame("g1", handler);

    dispatch(
      "game:g1:live",
      JSON.stringify({ gameId: "g1", move: { san: "e4" }, fen: "...", whiteTime: 300000, blackTime: 300000, turn: "w" }),
    );

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ gameId: "g1" }));
  });

  it("routes raw game messages for cross-node user delivery", () => {
    const handler = vi.fn();
    svc.subscribeToUserGameMessages("bob", handler);

    dispatch("user:bob:game_msg", "hello bob");

    expect(handler).toHaveBeenCalledWith("hello bob");
  });

  it("routes incoming game actions to the owner node", () => {
    const handler = vi.fn();
    svc.subscribeToGameMovesIn("g1", handler);

    dispatch("game:g1:moves_in", JSON.stringify({ type: "move", userId: "alice", from: "e2", to: "e4" }));

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ type: "move" }));
  });

  it("does not route messages to unrelated channels", () => {
    const handler = vi.fn();
    svc.subscribeToUserNotify("alice", handler);

    dispatch("user:bob:notify", JSON.stringify({ type: "match_found" }));

    expect(handler).not.toHaveBeenCalled();
  });
});

describe("RedisService.publishMove", () => {
  let svc: RedisService;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = new RedisService();
  });

  it("updates game state, appends move to history, and publishes live event", async () => {
    mocks.mockGet.mockResolvedValueOnce(
      JSON.stringify({ fen: "start", whiteTime: 300000, blackTime: 300000, turn: "w", status: "active", whitePlayerId: "w", blackPlayerId: "b" }),
    );

    await svc.publishMove(
      "g1",
      { san: "e4", uci: "e2e4", fen: "after-e4", whiteTime: 295000, blackTime: 300000, moveNumber: 1 },
      "after-e4",
      295000,
      300000,
      "b",
    );

    expect(mocks.mockSet).toHaveBeenCalledWith("game:g1:state", expect.stringContaining("after-e4"), "EX", 86400);
    expect(mocks.mockRpush).toHaveBeenCalledWith("game:g1:moves", expect.stringContaining("e2e4"));
    expect(mocks.mockPublish).toHaveBeenCalledWith("game:g1:live", expect.stringContaining("g1"));
  });

  it("does nothing when the game state key is missing", async () => {
    mocks.mockGet.mockResolvedValueOnce(null);
    await svc.publishMove("g1", { san: "e4", uci: "e2e4", fen: "x", whiteTime: 0, blackTime: 0, moveNumber: 1 }, "x", 0, 0, "b");
    expect(mocks.mockSet).not.toHaveBeenCalled();
  });
});
