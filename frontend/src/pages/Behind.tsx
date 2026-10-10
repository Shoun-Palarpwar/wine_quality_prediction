import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  GitBranch,
  FlaskConical,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";
import research from "../behind/research.json";
import { chapters, pipeline, modelNotes, milestones } from "../behind/content";
import { ResultsGallery } from "../behind/ResultsGallery";
import "../styles/behind.css";
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
export default function Behind() {
  const [step, setStep] = useState(0),
    [model, setModel] = useState("tuned"),
    [metric, setMetric] = useState<
      "Macro F1" | "Accuracy" | "Within one point"
    >("Macro F1");
  const reduced = useReducedMotion(),
    { scrollYProgress } = useScroll();
  const result = research.models.find((m) => m.Model === model)!,
    note = modelNotes[model];
  return (
    <article className="behind-page">
      <motion.div
        className="research-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <section className="research-hero" id="question">
        <div className="research-edition">
          <span>05 / BEHIND CANTINA</span>
          <span>A RESEARCH NOTEBOOK, OPENED.</span>
        </div>
        <div className="research-hero-grid">
          <Reveal>
            <span className="research-kicker">FROM CHEMISTRY TO CHARACTER</span>
            <h1>
              A little intuition.
              <br />A lot of <em>evidence.</em>
            </h1>
            <p>
              Before the bottle, there was a question.
              <br />
              Can eleven chemical measurements tell us what makes a wine worth
              remembering?
            </p>
            <a href="#method" className="research-start">
              Follow the experiment <ArrowDown size={18} />
            </a>
          </Reveal>
          <div
            className="research-specimen"
            aria-label="Illustration of chemical inputs branching through a forest model"
          >
            <svg
              viewBox="0 0 440 360"
              role="img"
              aria-label="Eleven measurements become many decision paths and one quality estimate"
            >
              <defs>
                <linearGradient id="research-line">
                  <stop stopColor="#b72450" />
                  <stop offset="1" stopColor="#d4b47c" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <g key={n}>
                  <motion.path
                    d={`M 40 ${45 + n * 25} C 160 ${45 + n * 25}, 155 180, 220 180 S 310 ${70 + (n % 4) * 72}, 392 ${70 + (n % 4) * 72}`}
                    stroke="url(#research-line)"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: reduced ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.8,
                      delay: reduced ? 0 : n * 0.07,
                    }}
                  />
                  <circle cx="40" cy={45 + n * 25} r="3" fill="#b88f72" />
                </g>
              ))}
              <circle
                cx="220"
                cy="180"
                r="45"
                fill="#170e12"
                stroke="#946f57"
              />
              <text
                x="220"
                y="176"
                textAnchor="middle"
                fill="#ecdec9"
                fontSize="27"
                fontFamily="Georgia"
              >
                11 → 1
              </text>
              <text
                x="220"
                y="198"
                textAnchor="middle"
                fill="#ad897c"
                fontSize="8"
                letterSpacing="2"
              >
                THE QUESTION
              </text>
              {[0, 1, 2, 3].map((n) => (
                <circle
                  key={n}
                  cx="392"
                  cy={70 + n * 72}
                  r="6"
                  fill="#582136"
                  stroke="#bd8f70"
                />
              ))}
            </svg>
            <div>
              <span>PHYSICOCHEMICAL INPUTS</span>
              <span>LEARNED PATTERNS</span>
            </div>
            <p>Conceptual illustration · not an extracted decision tree</p>
          </div>
        </div>
        <div className="research-statline">
          {[
            ["1,599", "original records"],
            ["11", "chemical features"],
            ["5", "model approaches"],
            ["1", "question worth asking"],
          ].map(([n, t]) => (
            <div key={t}>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>
      <nav className="research-chapters" aria-label="Research chapters">
        {chapters.map(([id, title], i) => (
          <a key={id} href={`#${id}`}>
            <span>0{i + 1}</span>
            {title}
          </a>
        ))}
      </nav>
      <section id="method" className="research-section">
        <Reveal className="research-section-heading">
          <span className="research-kicker">01 / THE METHOD</span>
          <h2>
            A good result starts
            <br />
            with a <em>fair experiment.</em>
          </h2>
          <p>
            Follow a sample from raw data to the interface. Every stage has a
            purpose—and a traceable place in the code.
          </p>
        </Reveal>
        <div className="research-pipeline">
          <div
            className="pipeline-steps"
            role="group"
            aria-label="Explore pipeline stages"
          >
            {pipeline.map((p, i) => (
              <button
                key={p.title}
                aria-pressed={step === i}
                onClick={() => setStep(i)}
              >
                <span>0{i + 1}</span>
                {p.title}
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <motion.div
            key={step}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            className="pipeline-detail"
            aria-live="polite"
          >
            <span className="research-kicker">{pipeline[step].tag}</span>
            <h3>{pipeline[step].title}.</h3>
            <p>{pipeline[step].text}</p>
            <blockquote>{pipeline[step].detail}</blockquote>
            <code>{pipeline[step].file}</code>
          </motion.div>
        </div>
        <Reveal className="research-data-note">
          <FlaskConical size={26} />
          <div>
            <h3>The difficult part? Most wines sit in the middle.</h3>
            <p>
              Scores 5 and 6 account for 1,112 of the 1,359 cleaned samples.
              Only 10 score 3 and 17 score 8. A system can appear accurate while
              barely recognizing those rare classes.
            </p>
            <div className="quality-distribution">
              {Object.entries(research.summary.quality_counts).map(([q, n]) => (
                <div key={q}>
                  <span>Q{q}</span>
                  <i style={{ height: Math.max(5, (n / 577) * 66) }} />
                  <strong>{n}</strong>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <section id="models" className="research-section models-section">
        <Reveal className="research-section-heading">
          <span className="research-kicker">02 / THE MODELS</span>
          <h2>
            One problem.
            <br />
            <em>Five ways to learn.</em>
          </h2>
          <p>
            Explore the theory, then compare it with the observed results. These
            are alternative approaches within one experiment—not five unrelated
            products.
          </p>
        </Reveal>
        <div
          className="model-selector"
          role="group"
          aria-label="Choose model approach"
        >
          {research.models.map((m) => (
            <button
              key={m.Model}
              aria-pressed={model === m.Model}
              onClick={() => setModel(m.Model)}
            >
              {m.Model}
              {m.Model === research.metadata.selected_model && (
                <span>SELECTED</span>
              )}
            </button>
          ))}
        </div>
        <div className="model-explainer">
          <motion.div
            key={model}
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
          >
            <span className="research-kicker">{note.subtitle}</span>
            <h3>{note.name}</h3>
            <p>{note.theory}</p>
            <code>{note.approach}</code>
            <p className="research-caveat">{note.caveat}</p>
          </motion.div>
          <div className="model-score">
            <span>TRAINING · 5-FOLD CV</span>
            <strong>{result["CV macro F1"].toFixed(3)}</strong>
            <p>
              Mean macro F1 ± {result["CV standard deviation"].toFixed(3)} SD
            </p>
            <hr />
            <span>HELD-OUT · 272 SAMPLES</span>
            <dl>
              <div>
                <dt>Exact accuracy</dt>
                <dd>{(result.Accuracy * 100).toFixed(1)}%</dd>
              </div>
              <div>
                <dt>Macro F1</dt>
                <dd>{result["Macro F1"].toFixed(3)}</dd>
              </div>
              <div>
                <dt>Mean absolute error</dt>
                <dd>{result.MAE.toFixed(3)}</dd>
              </div>
              <div>
                <dt>Weighted kappa</dt>
                <dd>{result["Quadratic weighted kappa"].toFixed(3)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="research-comparison">
          <header>
            <h3>What does “better” mean?</h3>
            <label>
              Compare by
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as typeof metric)}
              >
                <option>Macro F1</option>
                <option>Accuracy</option>
                <option>Within one point</option>
              </select>
            </label>
          </header>
          <p>
            {metric === "Macro F1"
              ? "Mean of per-class F1 scores: each class matters equally."
              : metric === "Accuracy"
                ? "Fraction of exact matches. Frequent middle scores dominate this measure."
                : "Fraction within ±1 quality point. A generous tolerance, not exact prediction."}{" "}
            Held-out results; higher is better.
          </p>
          {research.models.map((m) => (
            <div className="comparison-row" key={m.Model}>
              <span>{m.Model}</span>
              <div>
                <motion.i
                  animate={{ scaleX: m[metric] }}
                  transition={{ duration: reduced ? 0 : 0.65 }}
                  className={m.Model === "tuned" ? "selected" : ""}
                />
              </div>
              <strong>
                {metric === "Macro F1"
                  ? m[metric].toFixed(3)
                  : `${(m[metric] * 100).toFixed(1)}%`}
              </strong>
            </div>
          ))}
          <p className="research-caveat">
            The tuned model wins on training CV macro F1 (0.320), not test
            accuracy. Its 60.3% test accuracy is slightly below the baseline’s
            60.7%, while its test macro F1 is higher. Reporting both keeps that
            tradeoff visible.
          </p>
        </div>
      </section>
      <section id="evidence" className="research-section">
        <Reveal className="research-section-heading">
          <span className="research-kicker">03 / THE EVIDENCE ROOM</span>
          <h2>
            No stock charts.
            <br />
            <em>The actual experiment.</em>
          </h2>
          <p>
            Distributions, correlations, feature importance and confusion
            matrices—alongside the JPGs documenting the interface’s evolution.
          </p>
        </Reveal>
        <ResultsGallery />
        <div className="research-reading">
          <details>
            <summary>How to read a confusion matrix</summary>
            <p>
              Rows are actual quality classes; columns are predictions. The
              diagonal contains correct predictions. Off-diagonal cells show
              which scores the model confuses. Always inspect the rare classes,
              not just the largest counts.
            </p>
          </details>
          <details>
            <summary>What feature importance does—and does not—tell us</summary>
            <p>
              The forest reports impurity-based importance: how much a feature
              contributed to reducing split impurity. Correlated features can
              share or distort importance. This is not proof of causation or a
              personalized explanation for an individual wine.
            </p>
          </details>
          <details>
            <summary>Why correlation is not a recipe for better wine</summary>
            <p>
              Pearson correlation describes a linear association in this
              dataset. It does not establish that changing one chemical
              measurement will improve a wine’s sensory score.
            </p>
          </details>
        </div>
      </section>
      <section id="creation" className="research-section">
        <Reveal className="research-section-heading">
          <span className="research-kicker">04 / THE MAKING OF CANTINA</span>
          <h2>
            From a Python script
            <br />
            to a <em>digital sommelier.</em>
          </h2>
        </Reveal>
        <div className="research-timeline">
          {milestones.map(([n, title, text]) => (
            <Reveal key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="research-stack">
          <div>
            <GitBranch />
            <h3>The scientific engine</h3>
            <p>
              pandas + NumPy for data integrity. scikit-learn for forests,
              stratified cross-validation and metrics. Matplotlib + seaborn for
              the saved figures. joblib for model persistence.
            </p>
          </div>
          <div>
            <Code2 />
            <h3>The experience layer</h3>
            <p>
              Vite, React and TypeScript; Tailwind and custom CSS. Framer Motion
              drives this page’s reveals, model transitions and comparison bars.
              GSAP and Lenis support the existing site’s motion and scrolling.
            </p>
          </div>
        </div>
        <div className="research-limits">
          <span className="research-kicker">THE HONEST FOOTNOTE</span>
          <h3>
            A useful experiment.
            <br />
            An unfinished research story.
          </h3>
          <p>
            This study uses one red-wine dataset and one held-out split.
            Minority classes are sparse, model probabilities are uncalibrated,
            and a prediction is not an official wine classification. There is no
            evidence here of generalization to other regions, white wines or new
            production conditions.
          </p>
          <p>
            Next research steps: repeated or nested validation, calibrated
            probabilities with separate validation data, permutation-based
            interpretation, and external-dataset testing. These are proposed
            extensions, not completed results.
          </p>
        </div>
        <footer className="research-sources">
          <h3>Read the source material.</h3>
          <a
            href="https://archive.ics.uci.edu/dataset/186/wine+quality"
            target="_blank"
            rel="noreferrer"
          >
            UCI Wine Quality · Cortez et al. <ArrowUpRight size={15} />
          </a>
          <a
            href="https://scikit-learn.org/stable/modules/ensemble.html#forest"
            target="_blank"
            rel="noreferrer"
          >
            scikit-learn · Random forest theory <ArrowUpRight size={15} />
          </a>
          <p>
            Project evidence: reports/tables, reports/figures,
            models/metadata.json and wine_quality/. This page uses a build-time
            snapshot; regenerate it with{" "}
            <code>python3 frontend/scripts/sync-research.py</code> after
            rerunning the experiment.
          </p>
          <Link to="/lab" className="research-start">
            Now compose your own vintage <ArrowUpRight size={18} />
          </Link>
        </footer>
      </section>
    </article>
  );
}
