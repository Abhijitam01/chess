import { describe, it, expect } from "vitest";
import { calcElo } from "../game.js";

describe("calcElo", () => {
  it("awards positive delta to the winner (equal ratings)", () => {
    const delta = calcElo(1000, 1000, 1);
    expect(delta).toBe(16); // K=32, expected=0.5, actual=1 → 32*(1-0.5)=16
  });

  it("deducts negative delta from the loser (equal ratings)", () => {
    const delta = calcElo(1000, 1000, 0);
    expect(delta).toBe(-16);
  });

  it("returns 0 change for a draw between equal players", () => {
    const delta = calcElo(1000, 1000, 0.5);
    expect(delta).toBe(0);
  });

  it("awards small delta when strong player beats weak player", () => {
    // 400-point gap: expected win probability ≈ 0.909
    const delta = calcElo(1400, 1000, 1);
    expect(delta).toBeCloseTo(Math.round(32 * (1 - 0.9091)), 0);
  });

  it("awards large delta when underdog beats strong player", () => {
    const delta = calcElo(1000, 1400, 1);
    expect(delta).toBeCloseTo(Math.round(32 * (1 - 0.0909)), 0);
  });

  it("caps upside: strong player loses big if they lose to weak player", () => {
    const strongLoses = calcElo(1400, 1000, 0);
    const weakLoses = calcElo(1000, 1400, 0);
    expect(Math.abs(strongLoses)).toBeGreaterThan(Math.abs(weakLoses));
  });

  it("white + black deltas sum to 0 for equal ratings (zero-sum)", () => {
    const whiteWins = calcElo(1200, 1200, 1);
    const blackLoses = calcElo(1200, 1200, 0);
    expect(whiteWins + blackLoses).toBe(0);
  });

  it("draw between equal players produces symmetric 0 changes", () => {
    const w = calcElo(1500, 1500, 0.5);
    const b = calcElo(1500, 1500, 0.5);
    expect(w).toBe(0);
    expect(b).toBe(0);
  });

  it("handles extreme rating gap (1000 vs 3000)", () => {
    const topBeatsBottom = calcElo(3000, 1000, 1);
    const bottomBeatsTop = calcElo(1000, 3000, 1);
    // Expected ≈ 1 for top, so delta ≈ 0
    expect(topBeatsBottom).toBeGreaterThanOrEqual(0);
    // Expected ≈ 0 for bottom, so delta ≈ 32
    expect(bottomBeatsTop).toBeCloseTo(32, 0);
  });
});
