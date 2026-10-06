import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  FlaskConical,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { BottleArtifact } from "../components/BottleArtifact";
import { Terminal } from "../components/Terminal";
import { useScrollReveal } from "../hooks/useAtmosphere";

export default function Cellar() {
  const ref = useScrollReveal();
  return (
    <div ref={ref}>
      <section className="cellar-hero">
        <div className="hero-coordinate coordinate-left">
          41°09′ N / 08°37′ W<span>VINHO VERDE · PORTUGAL</span>
        </div>
        <div className="hero-coordinate coordinate-right">
          BATCH / CRU–001<span>RED WINE RESEARCH COLLECTION</span>
        </div>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> VINTAGE PREDICTION MATRIX
          </div>
          <h1>
            The art of wine.
            <br />
            The precision
            <br />
            of <em>intelligence.</em>
          </h1>
          <p>
            Centuries of intuition. Eleven chemical signatures.
            <br className="desktop-break" /> Discover the character hidden
            within every vintage.
          </p>
          <div className="hero-buttons">
            <Link to="/lab" className="button-primary">
              Analyze your vintage <ArrowUpRight size={18} />
            </Link>
            <Link to="/intelligence" className="button-text">
              Explore the science <ArrowRight size={16} />
            </Link>
          </div>
          <Terminal />
        </div>
        <div className="hero-art">
          <span className="artifact-vertical">HERITAGE, DECODED.</span>
          <BottleArtifact />
          <div className="specimen-tag tag-alcohol">
            <span className="tag-line" />
            <small>01 / ALCOHOL</small>
            <strong>
              13.0 <span>% vol</span>
            </strong>
            <i>ILLUSTRATIVE PROFILE</i>
          </div>
          <div className="specimen-tag tag-acidity">
            <span className="tag-line" />
            <small>02 / VOLATILE ACIDITY</small>
            <strong>
              0.28 <span>g/dm³</span>
            </strong>
            <div className="mini-wave">▂ ▃ ▅ ▃ ▆ ▄ ▂ ▅ ▃ ▂</div>
          </div>
          <div className="artifact-id">
            <Fingerprint size={28} strokeWidth={1} />
            <span>
              CHEMICAL FINGERPRINT
              <br />
              <strong>11 PARAMETERS / ONE IDENTITY</strong>
            </span>
          </div>
        </div>
        <a className="scroll-cue" href="#discovery">
          <span>
            <ArrowDown size={14} />
          </span>
          SCROLL TO DISCOVER
        </a>
        <span className="hero-edition">
          THE DIGITAL SOMMELIER — ÉDITION 001
        </span>
      </section>
      <section
        className="credentials-strip"
        aria-label="Research specifications"
      >
        <div>
          <span>01 — THE COLLECTION</span>
          <strong>
            1,359 <small>unique wine samples</small>
          </strong>
        </div>
        <div>
          <span>02 — THE SIGNATURE</span>
          <strong>
            11 <small>chemical dimensions</small>
          </strong>
        </div>
        <div>
          <span>03 — THE ENGINE</span>
          <strong>
            Random Forest <small>machine intelligence</small>
          </strong>
        </div>
        <div className="strip-seal">
          <ScanLine size={25} strokeWidth={1} />
          <span>
            ROOTED IN SCIENCE.
            <br />
            REFINED BY CURIOSITY.
          </span>
        </div>
      </section>
      <section className="discovery-section" id="discovery">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">BEYOND THE LABEL</span>
            <h2>
              Every vintage has a story.
              <br />
              <em>We read between the molecules.</em>
            </h2>
          </div>
          <p>
            A laboratory for the curious.
            <br />A new perspective on an ancient craft.
          </p>
        </div>
        <div className="discovery-grid">
          {[
            {
              number: "01",
              icon: FlaskConical,
              title: "Compose the chemistry",
              copy: "Shape eleven measurements with precision instruments. Explore the balance that defines a wine.",
              to: "/lab",
              action: "Enter the analysis lab",
            },
            {
              number: "02",
              icon: Sparkles,
              title: "Reveal the character",
              copy: "Translate chemistry into a predicted quality rating, with the full probability spectrum in view.",
              to: "/lab",
              action: "Begin a prediction",
            },
            {
              number: "03",
              icon: Fingerprint,
              title: "Understand the signature",
              copy: "Trace the associations behind the dataset. Discover what the model sees—and where its limits lie.",
              to: "/intelligence",
              action: "Explore intelligence",
            },
          ].map((card) => (
            <Link
              to={card.to}
              key={card.number}
              className="discovery-card"
              data-reveal
            >
              <div className="card-top">
                <card.icon size={25} strokeWidth={1.2} />
                <span>{card.number} /</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <span className="card-action">
                {card.action}
                <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
