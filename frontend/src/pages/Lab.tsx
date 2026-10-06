import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
  FlaskConical,
  CircleHelp,
} from "lucide-react";
import {
  compounds,
  defaults,
  presets,
  validMeasurements,
} from "../data/compounds";
import { ChemicalControl } from "../components/ChemicalControl";
import { useVault } from "../state/VaultContext";

export default function Lab() {
  const { measurements, setMeasurements, setResult } = useVault();
  const [preset, setPreset] = useState("Balanced");
  const [group, setGroup] = useState("All compounds");
  const navigate = useNavigate();
  const visible = compounds.filter(
    (c) => group === "All compounds" || c.group === group,
  );
  function analyze() {
    setResult(null);
    navigate("/outcome", { state: { analyze: true } });
  }
  return (
    <div className="page-container lab-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">02 / THE SOMMELIER ANALYSIS LAB</span>
          <h1>
            Chemistry.
            <br />
            <em>With character.</em>
          </h1>
        </div>
        <p>
          Fine-tune the molecular signature of your wine.
          <br />
          Eleven instruments. One remarkable composition.
        </p>
      </div>
      <div className="lab-layout">
        <section
          className="instrument-panel"
          aria-label="Chemical Compound Destiller"
        >
          <div className="panel-heading">
            <div>
              <SlidersHorizontal size={17} />
              <h2>Chemical Compound Destiller</h2>
            </div>
            <span className="eyebrow">11 CHANNELS</span>
          </div>
          <div
            className="compound-tabs"
            role="group"
            aria-label="Filter compounds"
          >
            {["All compounds", "Structure", "Composition", "Balance"].map(
              (tab) => (
                <button
                  key={tab}
                  className={group === tab ? "selected" : ""}
                  aria-pressed={group === tab}
                  onClick={() => setGroup(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="controls-grid">
            {visible.map((c) => (
              <ChemicalControl
                key={c.key}
                compound={c}
                value={measurements[c.key]}
                index={compounds.indexOf(c)}
                onChange={(value) => {
                  setMeasurements({ ...measurements, [c.key]: value });
                  setPreset("Custom");
                }}
              />
            ))}
          </div>
          <div className="instrument-bottom">
            <span>
              <i className="live-dot" /> ALL CHANNELS MANUAL
            </span>
            <button
              onClick={() => {
                setMeasurements({ ...defaults });
                setPreset("Balanced");
              }}
            >
              <RotateCcw size={13} /> Reset instruments
            </button>
          </div>
        </section>
        <aside className="lab-sidebar">
          <div className="glass-panel specimen-panel">
            <span className="eyebrow">YOUR SPECIMEN / 001</span>
            <div className="specimen-orbit">
              <FlaskConical size={74} strokeWidth={0.75} />
              <i />
              <i />
              <i />
            </div>
            <h2>{preset} composition</h2>
            <p>RED WINE · RESEARCH SAMPLE</p>
            <div className="specimen-stats">
              <div>
                <span>Alcohol</span>
                <strong>
                  {measurements.alcohol.toFixed(1)}
                  <small> %</small>
                </strong>
              </div>
              <div>
                <span>pH balance</span>
                <strong>{measurements.pH.toFixed(2)}</strong>
              </div>
            </div>
            <button
              className="button-primary analyze-button"
              onClick={analyze}
              disabled={!validMeasurements(measurements)}
            >
              Decode this vintage <ArrowUpRight size={18} />
            </button>
            <small className="model-footnote">
              Powered by the saved, CV-selected model.
            </small>
          </div>
          <div className="preset-panel">
            <span className="eyebrow">START WITH A COMPOSITION</span>
            {presets.map((p) => (
              <button
                key={p.name}
                className={preset === p.name ? "preset active" : "preset"}
                onClick={() => {
                  setMeasurements({ ...p.values });
                  setPreset(p.name);
                }}
              >
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.description}</small>
                </span>
                <span className="preset-radio" />
              </button>
            ))}
          </div>
          <div className="lab-note">
            <CircleHelp size={17} />
            <p>
              Example profiles are illustrative. Predictions estimate expert
              ratings; they do not replace a tasting.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
