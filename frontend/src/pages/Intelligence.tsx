import { useEffect, useState } from "react";
import { ArrowUpRight, Database, GitBranch, Target } from "lucide-react";
import {
  getIntelligence,
  type Intelligence as IntelligenceData,
} from "../lib/api";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Intelligence() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [feature, setFeature] = useState("alcohol");
  const reduced = useReducedMotion();
  useEffect(() => {
    let active = true;
    setError("");
    getIntelligence()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const selected = data?.metrics.find(
    (row) => row.Model === data.selected_model,
  );
  const correlation = data?.correlations.find((row) => row.feature === feature);
  return (
    <div className="page-container intelligence-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">03 / CHEMICAL INTELLIGENCE</span>
          <h1>
            Behind the vintage.
            <br />
            <em>Inside the forest.</em>
          </h1>
        </div>
        <p>
          Open data. Observable patterns.
          <br />A clear view of what the model knows.
        </p>
      </div>
      {error ? (
        <div className="glass-panel data-error" role="alert">
          <h2>Intelligence unavailable</h2>
          <p>{error}</p>
          <button
            className="button-primary"
            onClick={() => setAttempt((a) => a + 1)}
          >
            Reconnect
          </button>
        </div>
      ) : !data ? (
        <div className="glass-panel data-error" role="status">
          <span className="eyebrow">RETRIEVING DATASET INTELLIGENCE…</span>
        </div>
      ) : (
        <div className="intelligence-grid">
          <section className="glass-panel collection-card">
            <div className="panel-icon">
              <Database size={20} />
              <span className="eyebrow">THE COLLECTION</span>
            </div>
            <strong className="big-stat">
              {data.clean_rows.toLocaleString()}
            </strong>
            <h2>Unique chemical signatures.</h2>
            <p>
              {data.raw_rows.toLocaleString()} original records.{" "}
              {data.raw_rows - data.clean_rows} exact duplicates removed. One
              red-wine research dataset from Portugal.
            </p>
            <div className="split-track">
              <span
                style={{
                  width: `${(data.train_rows / data.clean_rows) * 100}%`,
                }}
              />
            </div>
            <div className="split-labels">
              <span>{data.train_rows} TRAINING</span>
              <span>{data.test_rows} TEST</span>
            </div>
          </section>
          <section className="glass-panel distribution-card">
            <span className="eyebrow">THE QUALITY LANDSCAPE</span>
            <h2>A spectrum, not a verdict.</h2>
            <div className="distribution-bars">
              {data.distribution.map((d) => (
                <div key={d.label} className="distribution-column">
                  <span>{d.count}</span>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: reduced ? 0 : 0.7 }}
                    style={{
                      height: `${(d.count / Math.max(...data.distribution.map((v) => v.count))) * 130}px`,
                    }}
                  />
                  <strong>{d.label}</strong>
                </div>
              ))}
            </div>
            <p>
              Quality 5 and 6 dominate. Rare ratings remain difficult to
              predict.
            </p>
          </section>
          <section className="glass-panel correlation-card">
            <span className="eyebrow">MOLECULAR ASSOCIATIONS</span>
            <div className="correlation-header">
              <h2>The chemistry of character.</h2>
              <span>PEARSON r / −1 TO +1</span>
            </div>
            <div className="correlation-layout">
              <div className="correlation-list">
                {data.correlations.map((row) => (
                  <button
                    key={row.feature}
                    aria-pressed={feature === row.feature}
                    className={feature === row.feature ? "active" : ""}
                    onClick={() => setFeature(row.feature)}
                  >
                    <span>{row.feature}</span>
                    <div className="correlation-rail">
                      <i
                        className={row.value < 0 ? "negative" : ""}
                        style={{ width: `${Math.abs(row.value) * 100}%` }}
                      />
                    </div>
                    <strong>
                      {row.value > 0 ? "+" : ""}
                      {row.value.toFixed(3)}
                    </strong>
                  </button>
                ))}
              </div>
              <div className="correlation-detail">
                <span className="eyebrow">SELECTED SIGNATURE</span>
                <strong>
                  {correlation && correlation.value > 0 ? "+" : ""}
                  {correlation?.value.toFixed(3)}
                </strong>
                <h3>{feature}</h3>
                <p>
                  {correlation && correlation.value > 0
                    ? "Positively"
                    : "Negatively"}{" "}
                  associated with quality in this dataset. Correlation does not
                  establish causation.
                </p>
                <span className="detail-glyph" aria-hidden="true">
                  {correlation && correlation.value < 0 ? "↘" : "↗"}
                </span>
              </div>
            </div>
          </section>
          <section className="glass-panel model-card">
            <div className="panel-icon">
              <GitBranch size={20} />
              <span className="eyebrow">THE DECISION ENGINE</span>
            </div>
            <h2>
              Many trees.
              <br />
              <em>One prediction.</em>
            </h2>
            <p>
              Selected by five-fold cross-validation on training data. Macro F1
              gives every quality class equal weight.
            </p>
            <div className="model-name">
              {data.selected_model.toUpperCase()} RANDOM FOREST{" "}
              <span>SELECTED</span>
            </div>
            <Link to="/lab" className="button-text">
              Put the model to work <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="glass-panel performance-card">
            <div className="panel-icon">
              <Target size={19} />
              <span className="eyebrow">HELD-OUT REALITY CHECK</span>
            </div>
            <div className="performance-stats">
              <div>
                <strong>
                  {(Number(selected?.Accuracy ?? 0) * 100).toFixed(1)}
                  <small>%</small>
                </strong>
                <span>EXACT ACCURACY</span>
              </div>
              <div>
                <strong>
                  {Number(selected?.["Macro F1"] ?? 0).toFixed(3)}
                </strong>
                <span>MACRO F1</span>
              </div>
              <div>
                <strong>{Number(selected?.MAE ?? 0).toFixed(2)}</strong>
                <span>MEAN RATING ERROR</span>
              </div>
            </div>
            <p>
              Measured on {data.test_rows} held-out wines. A single split is a
              snapshot—not a guarantee for new wine populations.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
