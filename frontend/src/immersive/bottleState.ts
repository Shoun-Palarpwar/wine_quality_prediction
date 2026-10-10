export const faceNames = [
  "The estate",
  "The composition",
  "The vintage",
  "The intelligence",
];
export type BottlePhase = "editing" | "brewing" | "revealed" | "error";

/** Keep unbounded turns so crossing the fourth face never spins backwards 270°. */
export function faceForTurn(turn: number) {
  return ((turn % 4) + 4) % 4;
}

/** One quarter turn per intentional edge swipe. Vertical scrolling is never rotation. */
export function swipeTurn(dx: number, dy: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.5) return 0;
  return dx < 0 ? 1 : -1;
}

export function waitForFermentation(
  ms: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Cancelled", "AbortError"));
      return;
    }
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, ms);
    signal.addEventListener("abort", cancel, { once: true });
  });
}
