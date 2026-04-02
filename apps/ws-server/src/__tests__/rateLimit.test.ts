import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameManager } from "../GameManager.js";
import type { DatabaseService } from "../services/DatabaseService.js";
import type { RedisService } from "../services/RedisService.js";

// ── Minimal stubs ─────────────────────────────────────────────────────────────

function makeStubRedis(): RedisService {
  return {
    subscribeToUserNotify: vi.fn(),
    unsubscribeFromUserNotify: vi.fn(),
    unsubscribeFromUserGameMessages: vi.fn(),
    subscribeToUserGameMessages: vi.fn(),
    enqueueForMatchmaking: vi.fn().mockResolvedValue(undefined),
    tryDequeueMatchedPair: vi.fn().mockResolvedValue(null),
    getActiveGameForUser: vi.fn().mockResolvedValue(null),
    finishGame: vi.fn().mockResolvedValue(undefined),
  } as unknown as RedisService;
}

function makeStubDb(): DatabaseService {
  return {} as DatabaseService;
}

/** Build a mock WebSocket that records sent messages and exposes an 'emit' helper. */
function makeMockSocket() {
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
  const sent: string[] = [];

  const socket = {
    readyState: 1 as const, // OPEN
    send: vi.fn((data: string) => sent.push(data)),
    close: vi.fn(),
    on: vi.fn((event: string, cb: (...args: unknown[]) => void) => {
      listeners[event] ??= [];
      listeners[event].push(cb);
    }),
    emit: (event: string, ...args: unknown[]) => {
      listeners[event]?.forEach((cb) => cb(...args));
    },
    sent,
  };
  return socket;
}

// ── Helpers to access private state ──────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const priv = (gm: GameManager): any => gm;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GameManager rate limiting", () => {
  let gm: GameManager;
  let redis: ReturnType<typeof makeStubRedis>;

  beforeEach(() => {
    redis = makeStubRedis();
    gm = new GameManager(makeStubDb(), redis);
  });

  it("allows messages within the token budget", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    // First 10 messages should all pass
    for (let i = 0; i < 10; i++) {
      const allowed = priv(gm).checkRateLimit(socket);
      expect(allowed).toBe(true);
    }
  });

  it("blocks messages once the token bucket is exhausted", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    // Drain the bucket
    for (let i = 0; i < 10; i++) priv(gm).checkRateLimit(socket);

    // 11th message should be blocked
    const blocked = priv(gm).checkRateLimit(socket);
    expect(blocked).toBe(false);
  });

  it("refills tokens over time", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    // Drain
    for (let i = 0; i < 10; i++) priv(gm).checkRateLimit(socket);
    expect(priv(gm).checkRateLimit(socket)).toBe(false);

    // Fast-forward the bucket's lastRefill by 1 second
    const bucket = priv(gm).rateBuckets.get(socket);
    bucket.lastRefill -= 1000;

    // Should now have tokens again
    expect(priv(gm).checkRateLimit(socket)).toBe(true);
  });

  it("closes the socket after OVERAGE_CLOSE_THRESHOLD consecutive blocked messages", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    // Drain the bucket
    for (let i = 0; i < 10; i++) priv(gm).checkRateLimit(socket);

    // Trigger 5 consecutive overage calls
    for (let i = 0; i < 5; i++) priv(gm).checkRateLimit(socket);

    expect(socket.close).toHaveBeenCalledWith(1008, "Rate limit exceeded");
  });

  it("resets overageStreak when a message is allowed", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    // Drain
    for (let i = 0; i < 10; i++) priv(gm).checkRateLimit(socket);
    // One overage
    priv(gm).checkRateLimit(socket);
    expect(priv(gm).rateBuckets.get(socket).overageStreak).toBe(1);

    // Refill by rewinding the timestamp
    priv(gm).rateBuckets.get(socket).lastRefill -= 2000;
    priv(gm).checkRateLimit(socket); // allowed
    expect(priv(gm).rateBuckets.get(socket).overageStreak).toBe(0);
  });

  it("removes rate bucket when user disconnects", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");
    expect(priv(gm).rateBuckets.has(socket)).toBe(true);

    gm.removeUserFromGame(socket as never);
    expect(priv(gm).rateBuckets.has(socket)).toBe(false);
  });
});

describe("GameManager message routing", () => {
  let gm: GameManager;
  let redis: ReturnType<typeof makeStubRedis>;

  beforeEach(() => {
    redis = makeStubRedis();
    gm = new GameManager(makeStubDb(), redis);
  });

  it("ignores malformed JSON messages without throwing", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");
    expect(() => socket.emit("message", Buffer.from("{bad json"))).not.toThrow();
  });

  it("ignores messages that fail Zod validation", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");
    expect(() =>
      socket.emit("message", Buffer.from(JSON.stringify({ type: "UNKNOWN_TYPE" }))),
    ).not.toThrow();
  });

  it("enqueues user for matchmaking on INIT_GAME", async () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");

    socket.emit("message", Buffer.from(JSON.stringify({ type: "init_game" })));

    // Give the async handler a tick to run
    await vi.waitFor(() => expect(redis.enqueueForMatchmaking).toHaveBeenCalledWith("user1", "blitz"));
  });

  it("cleans up socket maps on disconnect", () => {
    const socket = makeMockSocket();
    gm.addUserToGame(socket as never, "user1");
    expect(priv(gm).userIdToSocket.has("user1")).toBe(true);

    gm.removeUserFromGame(socket as never);
    expect(priv(gm).userIdToSocket.has("user1")).toBe(false);
    expect(priv(gm).socketToUserId.has(socket)).toBe(false);
  });
});
