import { ArrowRight, Download, RotateCcw } from "lucide-react";
import { QualityDial } from "../components/QualityDial";
import { type Prediction } from "../lib/api";

type Props = {
  result: Prediction | null;
  edit: () => void;
  next?: () => void;
  detailed?: boolean;
};
export function VintageLabel({ result, edit, next, detailed = false }: Props) {
  if (!result)
    return (
      <div className="empty-bottle-label">
        <span className="label-eyebrow">YOUR VINTAGE IS STILL UNWRITTEN</span>
        <h2>
          Good things
          <br />
          take <em>chemistry.</em>
        </h2>
        <p>
          Compose your wine on the previous face to discover its predicted
          quality.
        </p>
        <button className="label-action" onClick={edit}>
          Compose a vintage <ArrowRight size={15} />
        </button>
      </div>
    );
  return (
    <div className={`vintage-label ${detailed ? "detailed-vintage" : ""}`}>
      <span className="label-eyebrow">
        {detailed ? `SPECIMEN / ${result.id}` : "YOUR VINTAGE, UNVEILED"}
      </span>
      <h2>
        {result.rating >= 7
          ? "An exceptional"
          : result.rating >= 5
            ? "A balanced"
            : "An unconventional"}
        <br />
        <em>expression.</em>
      </h2>
      <QualityDial rating={result.rating} />
      <span className="vintage-seal">CANTINA · PREDICTED EXPERT RATING</span>
      <p className="rating-disclosure">
        Observed training scores: 3–8.
        <br />
        An estimate, not an official wine classification.
      </p>
      <details className="label-details" open={detailed ? true : undefined}>
        <summary>Probability spectrum & analysis</summary>
        <div className="label-detail-content">
          {result.probabilities.length ? (
            <>
              <p>Uncalibrated probabilities—not verified confidence.</p>
              {result.probabilities.map((p) => (
                <div className="bottle-probability" key={p.label}>
                  <span>Q{p.label}</span>
                  <i>
                    <b style={{ width: `${p.probability * 100}%` }} />
                  </i>
                  <strong>{(p.probability * 100).toFixed(1)}%</strong>
                </div>
              ))}
            </>
          ) : (
            <p>This regressor does not supply class probabilities.</p>
          )}
          <p>
            Model: {result.model} ·{" "}
            {new Date(result.timestamp).toLocaleString()}
          </p>
          {result.warnings.map((w) => (
            <p className="bottle-warning" key={w}>
              {w}
            </p>
          ))}
          <a
            className="bottle-export"
            download={`cantina-${result.id}.json`}
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`}
          >
            Download full analysis <Download size={13} />
          </a>
        </div>
      </details>
      <div className="vintage-actions">
        <button className="label-subtle" onClick={edit}>
          <RotateCcw size={12} /> Refine composition
        </button>
        {next && (
          <button className="label-subtle" onClick={next}>
            Read the vintage <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
