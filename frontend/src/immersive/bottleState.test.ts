import { describe, expect, it, vi, afterEach } from "vitest";
import { faceForTurn, swipeTurn, waitForFermentation } from "./bottleState";

afterEach(() => vi.useRealTimers());
describe("bottle navigation", () => {
  it("wraps quarter-turns without rewinding the bottle", () => {
    expect([0, 1, 2, 3, 4, 5].map(faceForTurn)).toEqual([0, 1, 2, 3, 0, 1]);
    expect([-1, -2, -3, -4].map(faceForTurn)).toEqual([3, 2, 1, 0]);
  });
  it("only intentional horizontal edge swipes rotate", () => {
    expect(swipeTurn(-80, 5)).toBe(1);
    expect(swipeTurn(80, 5)).toBe(-1);
    expect(swipeTurn(20, 5)).toBe(0);
    expect(swipeTurn(60, 150)).toBe(0);
  });
});
describe("fermentation lifecycle", () => {
  it("holds the reveal for the presentation interval", async () => {
    vi.useFakeTimers();
    let complete = false;
    const promise = waitForFermentation(
      3200,
      new AbortController().signal,
    ).then(() => {
      complete = true;
    });
    await vi.advanceTimersByTimeAsync(3199);
    expect(complete).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(complete).toBe(true);
  });
  it("cancels the pending reveal and releases its timer", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const promise = waitForFermentation(3200, controller.signal);
    const assertion = expect(promise).rejects.toMatchObject({
      name: "AbortError",
    });
    controller.abort();
    await assertion;
    expect(vi.getTimerCount()).toBe(0);
  });
  it("rejects an already cancelled sequence", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      waitForFermentation(0, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
