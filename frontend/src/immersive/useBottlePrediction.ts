import { useEffect, useRef, useState } from "react";
import { predictWine, type Prediction } from "../lib/api";
import { type Measurements, validMeasurements } from "../data/compounds";
import { waitForFermentation, type BottlePhase } from "./bottleState";

/** Own each request and its theatrical minimum delay; cancel both on exit/retry. */
export function useBottlePrediction(
  reduced: boolean,
  onResult: (result: Prediction) => void,
) {
  const [phase, setPhase] = useState<BottlePhase>("editing");
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function brew(measurements: Measurements) {
    if (request.current || !validMeasurements(measurements)) return;
    const controller = new AbortController();
    request.current = controller;
    setPhase("brewing");
    setError("");
    try {
      const [result] = await Promise.all([
        predictWine({ ...measurements }, controller.signal),
        waitForFermentation(reduced ? 0 : 3200, controller.signal),
      ]);
      if (controller.signal.aborted) return;
      onResult(result);
      setPhase("revealed");
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(
          cause instanceof Error
            ? cause.message
            : "The analysis could not be completed.",
        );
        setPhase("error");
        controller.abort();
      }
    } finally {
      if (request.current === controller) request.current = null;
    }
  }
  function edit() {
    request.current?.abort();
    request.current = null;
    setPhase("editing");
    setError("");
  }
  return { phase, error, brew, edit };
}
