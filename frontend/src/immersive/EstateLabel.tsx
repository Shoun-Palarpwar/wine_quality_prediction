import { ArrowRight, Wine } from "lucide-react";

export function EstateLabel({ begin }: { begin: () => void }) {
  return (
    <div className="estate-label">
      <span className="label-eyebrow">THE DIGITAL SOMMELIER</span>
      <div className="estate-crest" aria-hidden="true">
        <span />
        <Wine size={34} strokeWidth={0.8} />
        <span />
      </div>
      <h1>
        Cantina
        <span>
          The bottle.
          <br />
          <em>The whole experience.</em>
        </span>
      </h1>
      <p>
        Turn a little. Discover a lot.
        <br />
        An entire wine laboratory,
        <br />
        bottled for the curious.
      </p>
      <div className="estate-vintage">
        <span>11 CHEMICAL SIGNATURES</span>
        <strong>One singular character.</strong>
      </div>
      <button className="label-action" onClick={begin}>
        Uncork the experience <ArrowRight size={16} />
      </button>
      <span className="label-hint">SWIPE THE GLASS EDGES TO TURN · 90°</span>
    </div>
  );
}
