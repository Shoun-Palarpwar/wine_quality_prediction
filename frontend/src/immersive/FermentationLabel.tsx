import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FlaskConical, Check } from "lucide-react";

const stages = [
  "Reading eleven signatures",
  "Exploring the decision forest",
  "Resolving the vintage",
];
export function FermentationLabel({ cancel }: { cancel: () => void }) {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const interval = window.setInterval(
      () => setStep((s) => Math.min(s + 1, 2)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, []);
  return (
    <div
      className="brewing-label"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="label-eyebrow">
        A LITTLE SCIENCE. A LITTLE SUSPENSE.
      </span>
      <div className="brew-symbol" aria-hidden="true">
        <FlaskConical size={52} strokeWidth={0.8} />
        <i />
        <i />
      </div>
      <h2>
        A vintage
        <br />
        in the <em>making.</em>
      </h2>
      <p>
        The forest is reading your wine.
        <br />
        Let the chemistry tell its story.
      </p>
      <div className="bottle-progress">
        <motion.i
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.93 }}
          transition={{ duration: reduced ? 0 : 3 }}
        />
      </div>
      <ol>
        {stages.map((text, index) => (
          <li className={index <= step ? "active" : ""} key={text}>
            <span>{index < step ? <Check size={11} /> : `0${index + 1}`}</span>
            {text}
          </li>
        ))}
      </ol>
      <button className="label-subtle" onClick={cancel}>
        Cancel & return to composition
      </button>
      <span className="label-hint">
        FERMENTATION VISUAL · LIVE MODEL REQUEST
      </span>
    </div>
  );
}
