export type Compound = {
  key: string;
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  group: string;
  description: string;
};

// UCI measurement units; slider ranges encompass the supplied red-wine dataset.
export const compounds: Compound[] = [
  {
    key: "fixed acidity",
    label: "Fixed acidity",
    symbol: "TA",
    unit: "g/dm³",
    min: 4,
    max: 16,
    step: 0.1,
    initial: 7.2,
    group: "Structure",
    description: "Nonvolatile acids contributing to the wine’s structure.",
  },
  {
    key: "volatile acidity",
    label: "Volatile acidity",
    symbol: "VA",
    unit: "g/dm³",
    min: 0,
    max: 1.6,
    step: 0.01,
    initial: 0.5,
    group: "Structure",
    description: "Volatile acids, expressed as acetic acid.",
  },
  {
    key: "citric acid",
    label: "Citric acid",
    symbol: "CA",
    unit: "g/dm³",
    min: 0,
    max: 1,
    step: 0.01,
    initial: 0.25,
    group: "Structure",
    description: "Citric acid concentration in the sample.",
  },
  {
    key: "residual sugar",
    label: "Residual sugar",
    symbol: "RS",
    unit: "g/dm³",
    min: 0,
    max: 16,
    step: 0.1,
    initial: 2.2,
    group: "Composition",
    description: "Sugar remaining after fermentation.",
  },
  {
    key: "chlorides",
    label: "Chlorides",
    symbol: "Cl",
    unit: "g/dm³",
    min: 0,
    max: 0.65,
    step: 0.001,
    initial: 0.08,
    group: "Composition",
    description: "Chloride concentration, expressed as sodium chloride.",
  },
  {
    key: "free sulfur dioxide",
    label: "Free sulfur dioxide",
    symbol: "SO₂",
    unit: "mg/dm³",
    min: 0,
    max: 75,
    step: 1,
    initial: 15,
    group: "Composition",
    description: "The unbound fraction of sulfur dioxide.",
  },
  {
    key: "total sulfur dioxide",
    label: "Total sulfur dioxide",
    symbol: "ΣSO₂",
    unit: "mg/dm³",
    min: 0,
    max: 300,
    step: 1,
    initial: 45,
    group: "Composition",
    description: "Combined free and bound sulfur dioxide.",
  },
  {
    key: "density",
    label: "Density",
    symbol: "ρ",
    unit: "g/cm³",
    min: 0.99,
    max: 1.004,
    step: 0.0001,
    initial: 0.9965,
    group: "Balance",
    description: "Mass per unit volume of the wine.",
  },
  {
    key: "pH",
    label: "pH balance",
    symbol: "pH",
    unit: "pH",
    min: 2.5,
    max: 4.1,
    step: 0.01,
    initial: 3.3,
    group: "Balance",
    description: "Acidity on the logarithmic pH scale.",
  },
  {
    key: "sulphates",
    label: "Sulphates",
    symbol: "SO₄",
    unit: "g/dm³",
    min: 0.3,
    max: 2.1,
    step: 0.01,
    initial: 0.62,
    group: "Balance",
    description: "Sulphate concentration, expressed as potassium sulphate.",
  },
  {
    key: "alcohol",
    label: "Alcohol",
    symbol: "ABV",
    unit: "% vol",
    min: 8,
    max: 15,
    step: 0.1,
    initial: 10.2,
    group: "Balance",
    description: "Alcohol content as a percentage by volume.",
  },
];

export type Measurements = Record<string, number>;
export const defaults: Measurements = Object.fromEntries(
  compounds.map((c) => [c.key, c.initial]),
);
export const presets: {
  name: string;
  description: string;
  values: Measurements;
}[] = [
  { name: "Balanced", description: "The reference profile", values: defaults },
  {
    name: "Bold",
    description: "Higher alcohol · lower volatile acidity",
    values: {
      ...defaults,
      "fixed acidity": 8.5,
      "volatile acidity": 0.28,
      "citric acid": 0.45,
      "residual sugar": 2,
      chlorides: 0.06,
      "free sulfur dioxide": 12,
      "total sulfur dioxide": 30,
      density: 0.995,
      pH: 3.35,
      sulphates: 0.9,
      alcohol: 13,
    },
  },
  {
    name: "Restrained",
    description: "Lower alcohol · higher volatile acidity",
    values: {
      ...defaults,
      "fixed acidity": 7.8,
      "volatile acidity": 0.88,
      "citric acid": 0,
      "residual sugar": 2.6,
      chlorides: 0.098,
      "free sulfur dioxide": 25,
      "total sulfur dioxide": 67,
      density: 0.9968,
      pH: 3.2,
      sulphates: 0.68,
      alcohol: 9.8,
    },
  },
];

export function precision(step: number) {
  return String(step).split(".")[1]?.length ?? 0;
}
export function validMeasurements(values: Measurements) {
  return compounds.every(
    (c) =>
      Number.isFinite(values[c.key]) &&
      values[c.key] >= c.min &&
      values[c.key] <= c.max,
  );
}
