import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getIntelligence, type Intelligence } from "../lib/api";

export function IntelligenceLabel({
  home,
  active,
}: {
  home: () => void;
  active: boolean;
}) {
  const [data, setData] = useState<Intelligence | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [feature, setFeature] = useState("alcohol");
  useEffect(() => {
    if (!active || data) return;
    let alive = true;
    setError("");
    getIntelligence()
      .then((value) => {
        if (alive) setData(value);
      })
      .catch((cause) => {
        if (alive) setError(cause.message);
      });
    return () => {
      alive = false;
    };
  }, [active, data, attempt]);
  const selected = data?.metrics.find(
    (row) => row.Model === data.selected_model,
  );
  const correlation = data?.correlations.find((c) => c.feature === feature);
  return (
    <div className="intelligence-label">
      <span className="label-eyebrow">THE BACK LABEL. THE FULL STORY.</span>
      <h2>
        Rooted in wine.
        <br />
        <em>Read by science.</em>
      </h2>
      {error ? (
        <div role="alert" className="label-error">
          <p>{error}</p>
          <button
            className="label-action"
            onClick={() => setAttempt((a) => a + 1)}
          >
            Reconnect
          </button>
        </div>
      ) : !data ? (
        <p role="status">Opening the cellar records…</p>
      ) : (
        <>
          <div className="bottle-data-pair">
            <div>
              <strong>{data.clean_rows.toLocaleString()}</strong>
              <span>UNIQUE WINES</span>
            </div>
            <div>
              <strong>11</strong>
              <span>CHEMICAL NOTES</span>
            </div>
          </div>
          <p>
            UCI red wine collection · Portugal
            <br />
            {data.train_rows} training / {data.test_rows} held-out samples.
          </p>
          <div className="bottle-association">
            <label htmlFor="bottle-feature">
              Explore a chemical association
            </label>
            <select
              id="bottle-feature"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
            >
              {data.correlations.map((c) => (
                <option key={c.feature} value={c.feature}>
                  {c.feature}
                </option>
              ))}
            </select>
            <div>
              <strong>
                {correlation && correlation.value > 0 ? "+" : ""}
                {correlation?.value.toFixed(3)}
              </strong>
              <span>
                PEARSON r<br />
                WITH QUALITY
              </span>
            </div>
            <p>Association, not a causal effect.</p>
          </div>
          <details className="label-details">
            <summary>How well does the model perform?</summary>
            <div className="label-detail-content">
              <p>
                Selected with training cross-validation; evaluated separately on
                held-out wines.
              </p>
              <dl>
                <div>
                  <dt>Exact accuracy</dt>
                  <dd>{(Number(selected?.Accuracy) * 100).toFixed(1)}%</dd>
                </div>
                <div>
                  <dt>Macro F1</dt>
                  <dd>{Number(selected?.["Macro F1"]).toFixed(3)}</dd>
                </div>
                <div>
                  <dt>Mean rating error</dt>
                  <dd>{Number(selected?.MAE).toFixed(2)}</dd>
                </div>
              </dl>
              <p>
                Rare quality classes remain difficult. One dataset cannot
                represent every wine.
              </p>
            </div>
          </details>
        </>
      )}
      <button className="label-subtle back-to-estate" onClick={home}>
        A full circle. Back to the estate. <ArrowRight size={14} />
      </button>
    </div>
  );
}
