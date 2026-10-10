import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Local vector artwork: no remote image, canvas loop, or large texture dependency. */
export function BottleArtifact({ compact = false }: { compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  return (
    <div
      className={`bottle-artifact ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <div className="artifact-glow" />
      <div className="orbital orbital-one" />
      <div className="orbital orbital-two" />
      <div className="orbital orbital-three" />
      <div className="artifact-cross cross-top">+</div>
      <div className="artifact-cross cross-bottom">+</div>
      <motion.svg
        className="bottle-svg"
        viewBox="0 0 360 670"
        initial={false}
        animate={reduced ? {} : { y: [0, -9, 0], rotate: [-8, -6, -8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#070908" />
            <stop offset=".13" stopColor="#233026" />
            <stop offset=".22" stopColor="#111c14" />
            <stop offset=".4" stopColor="#060c08" />
            <stop offset=".75" stopColor="#0a140e" />
            <stop offset=".92" stopColor="#243527" />
            <stop offset="1" stopColor="#060b08" />
          </linearGradient>
          <linearGradient id={`${id}foil`} x1="0" x2="1">
            <stop stopColor="#160a0d" />
            <stop offset=".3" stopColor="#5c1c2a" />
            <stop offset=".55" stopColor="#36111b" />
            <stop offset="1" stopColor="#100608" />
          </linearGradient>
          <linearGradient id={`${id}label`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e6d9bb" />
            <stop offset=".5" stopColor="#bba884" />
            <stop offset="1" stopColor="#dac6a1" />
          </linearGradient>
          <linearGradient id={`${id}shine`} x1="0" x2="1">
            <stop stopColor="#d9dbbb" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`${id}shadow`}
            x="-60%"
            y="-20%"
            width="220%"
            height="160%"
          >
            <feDropShadow
              dx="16"
              dy="22"
              stdDeviation="17"
              floodColor="#000"
              floodOpacity=".8"
            />
          </filter>
        </defs>
        <g filter={`url(#${id}shadow)`}>
          <path
            d="M145 50Q180 43 215 50L219 169C220 198 232 211 258 237Q271 252 271 283L271 582Q268 610 180 611Q92 610 89 582V283Q89 252 102 237C128 211 140 198 141 169Z"
            fill={`url(#${id}glass)`}
            stroke="#61704b"
            strokeOpacity=".32"
          />
          <path
            d="M145 51Q180 44 215 51L217 149Q181 155 143 149Z"
            fill={`url(#${id}foil)`}
            stroke="#92555c"
            strokeOpacity=".3"
          />
          {[64, 72, 79, 137, 143].map((y) => (
            <path
              key={y}
              d={`M145 ${y}Q180 ${y + 5} 215 ${y}`}
              fill="none"
              stroke="#ab7e72"
              strokeOpacity=".17"
            />
          ))}
          <path
            d="M114 260Q105 279 105 304V553"
            stroke={`url(#${id}shine)`}
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M248 269V552"
            stroke="#9fbb7e"
            strokeWidth="2"
            opacity=".12"
          />
          <path
            d="M90 325Q180 337 270 325V492Q180 508 90 492Z"
            fill={`url(#${id}label)`}
          />
          <path
            d="M103 340Q180 350 257 340V478Q180 490 103 478Z"
            fill="none"
            stroke="#76674a"
            strokeWidth=".7"
          />
          <text
            x="180"
            y="366"
            textAnchor="middle"
            fontSize="8"
            letterSpacing="4"
            fill="#5f503a"
          >
            L’INTELLIGENCE DU VIN
          </text>
          <path
            d="M165 383h30l-4 17q-11 12-22 0zm15 25v11m-9 0h18"
            fill="none"
            stroke="#662336"
            strokeWidth="1.3"
          />
          <text
            x="180"
            y="450"
            textAnchor="middle"
            fontSize="35"
            letterSpacing="4"
            fontFamily="Georgia,serif"
            fill="#351b1c"
          >
            Cantina
          </text>
          <text
            x="180"
            y="469"
            textAnchor="middle"
            fontSize="7"
            letterSpacing="3"
            fill="#655238"
          >
            VINTAGE PREDICTION MATRIX
          </text>
          <text
            x="180"
            y="550"
            textAnchor="middle"
            fontSize="10"
            letterSpacing="5"
            fill="#b49b70"
            opacity=".65"
          >
            ÉDITION 001
          </text>
          <ellipse
            cx="180"
            cy="587"
            rx="70"
            ry="9"
            fill="#040805"
            opacity=".7"
          />
        </g>
      </motion.svg>
      <div className="artifact-scan" />
      <div className="artifact-caption">SPECIMEN 001 / VITIS VINIFERA</div>
    </div>
  );
}
