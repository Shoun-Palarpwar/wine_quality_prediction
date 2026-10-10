import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  compounds,
  defaults,
  presets,
  validMeasurements,
  type Measurements,
} from "../data/compounds";
import { ChemicalControl } from "../components/ChemicalControl";

type Props = {
  values: Measurements;
  setValues: (values: Measurements) => void;
  brew: () => void;
};
export function CompositionLabel({ values, setValues, brew }: Props) {
  const [group, setGroup] = useState("Structure");
  return (
    <div className="composition-label">
      <span className="label-eyebrow">ELEVEN NOTES. YOUR COMPOSITION.</span>
      <h2>
        Compose the <em>character.</em>
      </h2>
      <div className="label-presets">
        <label htmlFor="bottle-preset">Start with a profile</label>
        <select
          id="bottle-preset"
          value=""
          onChange={(e) => {
            const preset = presets.find((p) => p.name === e.target.value);
            if (preset) setValues({ ...preset.values });
          }}
        >
          <option value="" disabled>
            Choose a profile
          </option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          title="Reset measurements"
          aria-label="Reset all bottle measurements"
          onClick={() => setValues({ ...defaults })}
        >
          <RotateCcw size={13} />
        </button>
      </div>
      <div
        className="label-groups"
        role="group"
        aria-label="Chemical measurement groups"
      >
        {["Structure", "Composition", "Balance"].map((name, index) => (
          <button
            key={name}
            aria-pressed={group === name}
            onClick={() => setGroup(name)}
          >
            <span>0{index + 1}</span>
            {name}
          </button>
        ))}
      </div>
      <div className="bottle-controls">
        {compounds
          .filter((c) => c.group === group)
          .map((c) => (
            <ChemicalControl
              key={c.key}
              compound={c}
              value={values[c.key]}
              index={0}
              onChange={(value) => setValues({ ...values, [c.key]: value })}
            />
          ))}
      </div>
      <button
        className="label-action"
        onClick={brew}
        disabled={!validMeasurements(values)}
      >
        Distill this vintage <ArrowRight size={15} />
      </button>
      <span className="label-hint">
        ALL 11 VALUES ARE INCLUDED · REAL MODEL INFERENCE
      </span>
    </div>
  );
}
