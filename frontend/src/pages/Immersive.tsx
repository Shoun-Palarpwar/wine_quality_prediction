import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useVault } from "../state/VaultContext";
import { BottleScene } from "../immersive/BottleScene";
import { LabelFrame } from "../immersive/LabelFrame";
import { EstateLabel } from "../immersive/EstateLabel";
import { CompositionLabel } from "../immersive/CompositionLabel";
import { FermentationLabel } from "../immersive/FermentationLabel";
import { VintageLabel } from "../immersive/VintageLabel";
import { IntelligenceLabel } from "../immersive/IntelligenceLabel";
import { useBottlePrediction } from "../immersive/useBottlePrediction";
import { faceForTurn, faceNames } from "../immersive/bottleState";
import "../styles/immersive.css";

export default function Immersive() {
  const { measurements, setMeasurements, result, setResult } = useVault();
  const reduced = Boolean(useReducedMotion());
  const [turn, setTurn] = useState(0);
  const [turning, setTurning] = useState(false);
  const turnLock = useRef(false);
  const active = faceForTurn(turn);
  const { phase, error, brew, edit } = useBottlePrediction(reduced, setResult);
  const rotate = useCallback(
    (direction: number) => {
      if (turnLock.current || phase === "brewing") return;
      turnLock.current = !reduced;
      setTurning(!reduced);
      setTurn((value) => value + direction);
    },
    [phase, reduced],
  );
  const settled = useCallback(() => {
    turnLock.current = false;
    setTurning(false);
  }, []);
  const refine = () => {
    edit();
    if (active === 2) rotate(-1);
  };
  const locked = turning || phase === "brewing";
  const labelProps = { turn: rotate, locked };
  const faces = [
    <LabelFrame {...labelProps} face={0} key="estate">
      <EstateLabel begin={() => rotate(1)} />
    </LabelFrame>,
    <LabelFrame {...labelProps} face={1} key="composition">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="label-phase"
          key={phase}
          initial={{ y: reduced ? 0 : 38, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduced ? 0 : -100, opacity: 0 }}
          transition={{
            duration: reduced ? 0 : 0.65,
            ease: [0.22, 0.7, 0.15, 1],
          }}
        >
          {phase === "editing" ? (
            <CompositionLabel
              values={measurements}
              setValues={setMeasurements}
              brew={() => brew(measurements)}
            />
          ) : phase === "brewing" ? (
            <FermentationLabel cancel={edit} />
          ) : phase === "revealed" ? (
            <VintageLabel result={result} edit={edit} next={() => rotate(1)} />
          ) : (
            <div className="label-error" role="alert">
              <AlertCircle size={30} />
              <span className="label-eyebrow">THE CELLAR NEEDS A MOMENT</span>
              <h2>
                A pause in
                <br />
                the <em>process.</em>
              </h2>
              <p>{error}</p>
              <button
                className="label-action"
                onClick={() => brew(measurements)}
              >
                Try the analysis again
              </button>
              <button className="label-subtle" onClick={edit}>
                Return to your composition
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </LabelFrame>,
    <LabelFrame {...labelProps} face={2} key="vintage">
      <VintageLabel result={result} edit={refine} detailed />
    </LabelFrame>,
    <LabelFrame {...labelProps} face={3} key="intelligence">
      <IntelligenceLabel active={active === 3} home={() => rotate(1)} />
    </LabelFrame>,
  ];
  return (
    <div className="cantina-experience">
      <span className="sr-only" aria-live="polite">
        Face {active + 1} of 4: {faceNames[active]}
      </span>
      <BottleScene
        turn={turn}
        turning={turning}
        brewing={phase === "brewing"}
        close={active === 1 && phase === "editing"}
        faces={faces}
        onTurn={rotate}
        onSettled={settled}
      />
    </div>
  );
}
