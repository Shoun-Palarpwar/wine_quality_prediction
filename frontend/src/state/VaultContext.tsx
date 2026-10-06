import { createContext, useContext, useState, type ReactNode } from "react";
import { defaults, type Measurements } from "../data/compounds";
import type { Prediction } from "../lib/api";

type VaultState = {
  measurements: Measurements;
  setMeasurements: (values: Measurements) => void;
  result: Prediction | null;
  setResult: (result: Prediction | null) => void;
};
const VaultContext = createContext<VaultState | null>(null);
export function VaultProvider({ children }: { children: ReactNode }) {
  const [measurements, setMeasurements] = useState<Measurements>({
    ...defaults,
  });
  const [result, setResult] = useState<Prediction | null>(null);
  return (
    <VaultContext.Provider
      value={{ measurements, setMeasurements, result, setResult }}
    >
      {children}
    </VaultContext.Provider>
  );
}
export function useVault() {
  const context = useContext(VaultContext);
  if (!context) throw new Error("VaultProvider is required");
  return context;
}
