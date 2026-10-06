import type { Measurements } from "../data/compounds";

export type Prediction = {
  rating: number;
  model: string;
  probabilities: { label: number; probability: number }[];
  id: string;
  timestamp: string;
  measurements: Measurements;
  warnings: string[];
};
export type Intelligence = {
  raw_rows: number;
  clean_rows: number;
  train_rows: number;
  test_rows: number;
  correlations: { feature: string; value: number }[];
  distribution: { label: number; count: number }[];
  metrics: Record<string, string | number>[];
  selected_model: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    ...options,
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      body?.error ||
        "The analysis service is unavailable. Start the Python API and try again.",
    );
  if (!body)
    throw new Error("The analysis service returned an invalid response.");
  return body as T;
}
export const predictWine = (measurements: Measurements) =>
  request<Prediction>("predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(measurements),
  });
export const getIntelligence = () => request<Intelligence>("intelligence");
