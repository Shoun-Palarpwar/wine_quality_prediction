import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Check,
  AlertCircle,
} from "lucide-react";
import { predictWine, type Prediction } from "../lib/api";
import { useVault } from "../state/VaultContext";
import { QualityDial } from "../components/QualityDial";

const stages = [
  "Reading the molecular signature",
  "Traversing the decision forest",
  "Resolving the vintage profile",
];
export default function Outcome() {
  const { measurements, result, setResult } = useVault();
  const location = useLocation();
  const [loading, setLoading] = useState(Boolean(location.state?.analyze));
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const reduced = useReducedMotion();
  // Keep one request across StrictMode effect replay; UI timers always clean up.
  const requestRef = useRef<Promise<Prediction> | null>(null);
  useEffect(() => {
    if (!location.state?.analyze && attempt === 0) return;
    let disposed = false;
    setLoading(true);
    setError("");
    setStage(0);
    const stageTimer = window.setInterval(
      () => setStage((s) => Math.min(s + 1, 2)),
      750,
    );
    requestRef.current ??= predictWine(measurements);
    let revealTimer: number;
    const revealDelay = new Promise((resolve) => {
      revealTimer = window.setTimeout(resolve, reduced ? 0 : 2400);
    });
    Promise.all([requestRef.current, revealDelay])
      .then(([prediction]) => {
        if (!disposed) {
          setResult(prediction);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!disposed) {
          setError(
            e instanceof Error
              ? e.message
              : "Analysis failed. Please try again.",
          );
          setLoading(false);
        }
      })
      .finally(() => window.clearInterval(stageTimer));
    return () => {
      disposed = true;
      window.clearInterval(stageTimer);
      window.clearTimeout(revealTimer);
    };
  }, [attempt, location.state, measurements, reduced, setResult]);

  if (loading)
    return (
      <section
        className="fermentation-screen"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="data-streams" aria-hidden="true">
          {Object.entries(measurements)
            .slice(0, 6)
            .map(([key, value], index) => (
              <div
                className="stream-column"
                key={key}
                style={{ animationDelay: `${index * -0.65}s` }}
              >
                {Array.from({ length: 6 }, (_, row) => (
                  <span key={row}>
                    {key.toUpperCase()}
                    <br />
                    {value.toFixed(4)} / CNT–{row + 1}
                  </span>
                ))}
              </div>
            ))}
        </div>
        <div className="fermentation-rings">
          <i />
          <i />
          <i />
          <span>Cantina</span>
        </div>
        <span className="eyebrow">PREDICTION SEQUENCE / IN PROGRESS</span>
        <h1>
          Distilling <em>intelligence.</em>
        </h1>
        <div className="loading-track">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.94 }}
            transition={{ duration: reduced ? 0 : 2.2 }}
          />
        </div>
        <div className="processing-stages">
          {stages.map((s, i) => (
            <p key={s} className={i <= stage ? "active" : ""}>
              <span>{i < stage ? <Check size={13} /> : `0${i + 1}`}</span>
              {s}
            </p>
          ))}
        </div>
        <span className="processing-caption">
          VISUAL SEQUENCE · WAITING FOR MODEL RESPONSE
        </span>
      </section>
    );
  if (error)
    return (
      <div className="empty-state" role="alert">
        <AlertCircle size={32} />
        <span className="eyebrow">ANALYSIS INTERRUPTED</span>
        <h1>The cellar is offline.</h1>
        <p>{error}</p>
        <div className="hero-buttons">
          <button
            className="button-primary"
            onClick={() => {
              requestRef.current = null;
              setAttempt((a) => a + 1);
            }}
          >
            Retry analysis
          </button>
          <Link className="button-text" to="/lab">
            Return to instruments
          </Link>
        </div>
      </div>
    );
  if (!result)
    return (
      <div className="empty-state">
        <span className="eyebrow">NO SPECIMEN LOADED</span>
        <h1>A vintage awaits.</h1>
        <p>
          Compose a wine in the analysis lab to reveal its predicted quality.
        </p>
        <Link className="button-primary" to="/lab">
          Enter the lab <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  const descriptor =
    result.rating >= 7
      ? "An exceptional expression."
      : result.rating >= 5
        ? "A balanced expression."
        : "An unconventional expression.";
  return (
    <div className="page-container outcome-page">
      <div className="outcome-top">
        <Link className="button-text" to="/lab">
          <ArrowLeft size={14} /> Back to composition
        </Link>
        <span className="eyebrow">ANALYSIS / {result.id}</span>
      </div>
      <div className="outcome-layout">
        <section className="outcome-reveal">
          <span className="eyebrow">
            <span className="tiny-line" /> THE VINTAGE, REVEALED
          </span>
          <h1>
            {descriptor.split(" ").slice(0, -1).join(" ")}
            <br />
            <em>expression.</em>
          </h1>
          <QualityDial rating={result.rating} />
          <div className="rating-caption">
            <span className="live-dot" /> MODEL PREDICTION COMPLETE
          </div>
          <p>
            Predicted expert rating from your chemical signature.
            <br />
            Trained on observed scores 3–8; no official cru classification.
          </p>
        </section>
        <aside className="outcome-details">
          <div className="glass-panel probability-panel">
            <span className="eyebrow">THE PROBABILITY SPECTRUM</span>
            <h2>Character has nuance.</h2>
            <p>Uncalibrated model probabilities—not verified confidence.</p>
            {result.probabilities.length ? (
              result.probabilities.map((p) => (
                <div
                  className={`probability-row ${p.label === result.rating ? "winner" : ""}`}
                  key={p.label}
                >
                  <span>QUALITY {p.label}</span>
                  <div>
                    <motion.i
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: p.probability }}
                      transition={{
                        duration: reduced ? 0 : 0.8,
                        delay: reduced ? 0 : 0.2,
                      }}
                    />
                  </div>
                  <strong>{(p.probability * 100).toFixed(1)}%</strong>
                </div>
              ))
            ) : (
              <p>This regression model does not supply class probabilities.</p>
            )}
          </div>
          <div className="result-metadata">
            <div>
              <span>MODEL</span>
              <strong>{result.model} / Random Forest</strong>
            </div>
            <div>
              <span>SPECIMEN</span>
              <strong>11 chemical measurements</strong>
            </div>
            <div>
              <span>ANALYZED</span>
              <strong>{new Date(result.timestamp).toLocaleString()}</strong>
            </div>
          </div>
          {result.warnings.map((w) => (
            <p className="result-warning" key={w}>
              <AlertCircle size={15} />
              {w}
            </p>
          ))}
          <a
            className="button-primary w-full"
            download={`cantina-${result.id}.json`}
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`}
          >
            Export analysis <Download size={16} />
          </a>
          <Link className="button-text justify-center mt-5" to="/intelligence">
            Understand the model <ArrowUpRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
