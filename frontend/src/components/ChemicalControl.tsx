import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { precision, type Compound } from "../data/compounds";

type Props = {
  compound: Compound;
  value: number;
  onChange: (value: number) => void;
  index: number;
};

/** Native range retains keyboard/touch/AT semantics; only the decorative rail is spring animated. */
export function ChemicalControl({
  compound: c,
  value,
  onChange,
  index,
}: Props) {
  const id = useId();
  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState(value.toFixed(precision(c.step)));
  const reduced = useReducedMotion();
  const normalized = (value - c.min) / (c.max - c.min);
  const position = useMotionValue(normalized);
  const spring = useSpring(position, {
    stiffness: 400,
    damping: 35,
    mass: 0.5,
  });
  const percentage = useTransform(
    reduced ? position : spring,
    (v) => `${v * 100}%`,
  );
  useEffect(() => {
    position.set(normalized);
  }, [normalized, position]);
  useEffect(() => {
    setDraft(value.toFixed(precision(c.step)));
  }, [value, c.step]);

  function commit(next: number) {
    if (!Number.isFinite(next)) {
      setDraft(value.toFixed(precision(c.step)));
      return;
    }
    const bounded = Math.min(c.max, Math.max(c.min, next));
    const snapped = c.min + Math.round((bounded - c.min) / c.step) * c.step;
    onChange(Number(snapped.toFixed(precision(c.step))));
    setDraft(snapped.toFixed(precision(c.step)));
  }

  return (
    <motion.div
      className={`chemical-control ${active ? "control-active" : ""}`}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
    >
      <div className="control-heading">
        <span className="compound-symbol">{c.symbol}</span>
        <span className="control-index">
          CH / {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <label htmlFor={`${id}-range`} className="control-label">
        {c.label}
      </label>
      <div className="control-reading">
        <input
          id={`${id}-number`}
          aria-label={`${c.label} numeric value`}
          type="number"
          min={c.min}
          max={c.max}
          step={c.step}
          value={draft}
          onFocus={() => setActive(true)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            commit(draft.trim() ? Number(draft) : NaN);
            setActive(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
        <span>{c.unit}</span>
      </div>
      <div className="range-instrument">
        <div className="range-track">
          <motion.div
            className="range-fill"
            style={{ scaleX: reduced ? position : spring }}
          />
          <motion.i className="range-thumb" style={{ left: percentage }} />
        </div>
        <input
          id={`${id}-range`}
          aria-describedby={`${id}-description`}
          aria-valuetext={`${value} ${c.unit}`}
          type="range"
          min={c.min}
          max={c.max}
          step={c.step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        />
      </div>
      <div className="range-scale">
        <button
          type="button"
          aria-label={`Decrease ${c.label}`}
          disabled={value <= c.min}
          onClick={() => commit(value - c.step)}
        >
          <Minus size={12} />
        </button>
        <span>
          {c.min} <span className="scale-ticks">┊ ┊ ┊ ┊ ┊</span> {c.max}
        </span>
        <button
          type="button"
          aria-label={`Increase ${c.label}`}
          disabled={value >= c.max}
          onClick={() => commit(value + c.step)}
        >
          <Plus size={12} />
        </button>
      </div>
      <p id={`${id}-description`} className="sr-only">
        {c.description}
      </p>
    </motion.div>
  );
}
