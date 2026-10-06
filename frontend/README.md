# CRU.AI / Digital Sommelier Vault

A four-route, responsive React + TypeScript interface for the repository’s saved
wine-quality model. Visual language: obsidian, velvet maroon, crimson instrumentation,
parchment typography, and muted gold. All bottle artwork is local SVG.

## Start locally

In terminal 1, from the repository root with the Python dependencies installed:

```sh
python3 -m wine_quality.api
```

In terminal 2:

```sh
cd frontend
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. The Vite proxy forwards `/api/*` to the loopback Python
service at port 8000. No API key, third-party image host, or external font is needed.
The saved model and generated dataset reports must exist; if absent, run the Python
pipeline first. Use the tested Python dependencies for serialized model compatibility.

```sh
npm run build         # TypeScript checks + optimized production assets in dist/
npm test              # Instrument schema, presets, and validation tests
npm run preview       # Inspect the built assets on port 4173; API still required
```

From the repository root: `python3 -m unittest discover -s tests -v`.

## Modular architecture

```text
frontend/
├── index.html                    HTML entry, metadata, local favicon
├── package.json / package-lock.json
├── vite.config.ts                React build + local API proxy
├── tsconfig.json                 Strict TypeScript checks
├── tailwind.config.js            wine-dark / maroon-glow / crimson-neon tokens
├── postcss.config.js             Tailwind + Autoprefixer
├── public/favicon.svg
└── src/
    ├── main.tsx                  React root, router, shared vault provider
    ├── App.tsx                   Four routes, transitions, 404 handling
    ├── components/
    │   ├── Shell.tsx             Responsive navigation, skip link, footer
    │   ├── BottleArtifact.tsx    Original vector bottle + orbital composition
    │   ├── Terminal.tsx          Effect-cleaned terminal typewriter
    │   ├── ChemicalControl.tsx   Accessible, spring-animated modular instrument
    │   └── QualityDial.tsx       Animated result dial
    ├── pages/
    │   ├── Cellar.tsx            / — ambient entry and scroll discovery
    │   ├── Lab.tsx               /lab — all 11 controls, filters, presets, reset
    │   ├── Outcome.tsx           /outcome — calculation, result, retry, export
    │   └── Intelligence.tsx      /intelligence — actual dataset and test metrics
    ├── hooks/useAtmosphere.ts    Lenis RAF + scoped GSAP ScrollTrigger lifecycle
    ├── state/VaultContext.tsx    Measurements and latest result shared across pages
    ├── data/compounds.ts         Names, units, limits, steps, presets, validation
    ├── data/compounds.test.ts    Unit tests for the instrument schema
    ├── lib/api.ts               Typed HTTP contract, timeout, error handling
    └── styles/index.css         Design system, responsive layouts, motion fallbacks

../wine_quality/api.py            Local HTTP adapter around the saved Python model
../tests/test_api.py              Real model/service consistency and validation tests
```

## Interaction and data flow

1. The cellar introduces the collection; its calls to action open the lab or data hub.
2. The lab edits one shared measurement object. Filters preserve hidden values.
   Presets and reset update every instrument. Sliders accept pointer, touch, arrow
   keys, Home/End, number entry, and increment/decrement controls. Numeric entry is
   committed on blur/Enter, constrained to the instrument range, and rounded to the
   declared precision. Empty/invalid numeric drafts revert to the last valid value.
3. Decode opens `/outcome` and POSTs the full measurement object. The short visual
   sequence accompanies a real request; no fabricated result or random fallback is
   supplied. A failed service produces an error and retry controls.
4. The result shows the actual discrete quality rating, class probabilities when
   available, model metadata, and a downloadable JSON report including all inputs.
5. Intelligence reads the cleaned dataset and saved evaluation results. Correlation
   rows are selectable buttons, not decorative data. Distribution and metrics use
   the actual repository artifacts.

State lives in memory. Reloading loses the current composition/result and a direct
visit to `/outcome` offers a route back to the lab. No measurement is persisted to disk
or sent to an external service. Landing-page specimen callouts are labeled illustrative.

## Honest result presentation

This model learned observed ratings 3–8 on the source 0–10 quality scale. The reveal
therefore displays real model output, not a hardcoded 9.2 or an official “Grand Cru”
designation. The editorial descriptor is UI copy, not a recognized classification.
Probabilities are labeled uncalibrated. Values beyond the dataset’s marginal ranges
produce a warning; being inside those ranges does not prove a sample is in-distribution.

## Motion and performance

- Framer Motion handles page transitions, instrument springs, and the quality dial.
- GSAP ScrollTrigger reveals below-the-fold cards; scoped contexts clean up on unmount.
- Lenis is driven by GSAP’s existing ticker, with teardown on unmount. No second
  perpetual JavaScript animation loop is introduced.
- Most motion uses opacity and transforms. The small SVG rating stroke is the
  exception. Slider input state stays exact; the decorative track animates separately.
- Blur/glow layers are static, deliberately bounded, and are not animated filters.
- CSS and JavaScript respect `prefers-reduced-motion`; native scrolling and instant
  transitions replace inertia, floating, scanning, and spring animation.
- Native controls, explicit labels, focus rings, live statuses, and a skip link support
  keyboard and assistive-technology use. Layouts adapt at 1150, 800, and 700 pixels.

These choices target smooth rendering; a universal 60fps guarantee is not possible
across devices. Profile representative low-power phones before a production release.

## API / deployment boundary

| Endpoint | Behavior |
| --- | --- |
| GET `/api/health` | Model readiness |
| GET `/api/intelligence` | Dataset summaries, correlations, class counts, saved metrics |
| POST `/api/predict` | JSON object with all 11 numeric model features; returns prediction |

The standard-library API binds only to `127.0.0.1`, validates the schema, limits request
size, and keeps model files on the server. It is a local development adapter. For
public deployment, serve `dist/` with SPA fallbacks and proxy `/api` to a hardened
Python application server with appropriate request limits and operational monitoring.
The static frontend alone cannot execute the Python model. No hosting was provisioned.
