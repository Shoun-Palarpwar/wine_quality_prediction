import { describe, expect, it } from "vitest";
import {
  compounds,
  defaults,
  precision,
  presets,
  validMeasurements,
} from "./compounds";

describe("chemical instrument schema", () => {
  it("defines the eleven model features once", () => {
    expect(compounds).toHaveLength(11);
    expect(new Set(compounds.map((c) => c.key)).size).toBe(11);
    expect(validMeasurements(defaults)).toBe(true);
  });
  it("supports all illustrative profiles without clipping", () => {
    presets.forEach((preset) =>
      expect(validMeasurements(preset.values)).toBe(true),
    );
  });
  it("rejects missing, nonfinite, and out-of-control-range measurements", () => {
    expect(validMeasurements({ ...defaults, density: NaN })).toBe(false);
    expect(validMeasurements({ ...defaults, alcohol: Infinity })).toBe(false);
    expect(validMeasurements({ ...defaults, pH: 7 })).toBe(false);
    expect(validMeasurements({})).toBe(false);
  });
  it("retains fine-grained density and chloride precision", () => {
    expect(precision(0.0001)).toBe(4);
    expect(precision(0.001)).toBe(3);
    expect(precision(1)).toBe(0);
  });
});
