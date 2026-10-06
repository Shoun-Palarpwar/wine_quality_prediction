import { motion, useReducedMotion } from "framer-motion";

export function QualityDial({ rating }: { rating: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="quality-dial">
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <circle
          cx="150"
          cy="150"
          r="141"
          fill="none"
          stroke="#a6967925"
          strokeDasharray="1 8"
          strokeWidth="7"
        />
        <circle
          cx="150"
          cy="150"
          r="123"
          fill="none"
          stroke="#42212b"
          strokeWidth="2"
        />
        <motion.circle
          cx="150"
          cy="150"
          r="123"
          fill="none"
          stroke="#e6003a"
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-90 150 150)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: rating / 10 }}
          transition={{ duration: reduced ? 0 : 1.6, ease: "easeOut" }}
        />
        <circle cx="150" cy="150" r="104" fill="none" stroke="#a6967915" />
      </svg>
      <div className="dial-value">
        <span className="eyebrow">QUALITY RATING</span>
        <strong>{rating.toFixed(1)}</strong>
        <small>ON THE 0–10 QUALITY SCALE</small>
      </div>
    </div>
  );
}
