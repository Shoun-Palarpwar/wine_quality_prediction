import { Fragment, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { faceForTurn, swipeTurn } from "./bottleState";

type Props = {
  turn: number;
  turning: boolean;
  brewing: boolean;
  close: boolean;
  faces: ReactNode[];
  onTurn: (direction: number) => void;
  onSettled: () => void;
};
/** Rotate each plane around the shared vertical axis. Keeping the 3D parent
 * unrotated also preserves native hit testing for controls on quarter turns. */
export function BottleScene({
  turn,
  turning,
  brewing,
  close,
  faces,
  onTurn,
  onSettled,
}: Props) {
  const reduced = useReducedMotion();
  const origin = useRef<{ x: number; y: number } | null>(null);
  const active = faceForTurn(turn);
  const transition = {
    duration: reduced ? 0 : 1.15,
    ease: [0.22, 0.7, 0.15, 1] as const,
  };
  return (
    <div
      className={`bottle-theatre ${brewing ? "is-brewing" : ""} ${close ? "camera-close" : ""} ${turning ? "is-turning" : ""}`}
    >
      <div className="cellar-architecture" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="bottle-spotlight" aria-hidden="true" />
      <div className="bottle-aura" aria-hidden="true" />
      <div className="stage-dust" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--n": i } as CSSProperties} />
        ))}
      </div>
      <div className="bottle-plinth" aria-hidden="true">
        <div />
        <i />
        <b />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={i === active ? "active" : ""}
            style={{ "--n": i } as CSSProperties}
          />
        ))}
      </div>
      <div className="bottle-camera">
        <div className="bottle-perspective">
          <div className="bottle-object">
            {[0, 1, 2, 3].map((index) => (
              <Fragment key={index}>
                <motion.div
                  initial={false}
                  animate={{
                    transform: `rotateY(${(index - turn) * 90}deg) translateZ(48px)`,
                  }}
                  transition={transition}
                  className="bottle-neck-plane"
                  style={{ "--face": index } as CSSProperties}
                  aria-hidden="true"
                >
                  <span>C</span>
                  <i />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    transform: `rotateY(${(index - turn) * 90}deg) translateZ(var(--shoulder-depth)) rotateX(var(--shoulder-angle))`,
                  }}
                  transition={transition}
                  className="bottle-shoulder-plane"
                  style={{ "--face": index } as CSSProperties}
                  aria-hidden="true"
                />
                <motion.section
                  initial={false}
                  animate={{
                    transform: `rotateY(${(index - turn) * 90}deg) translateZ(var(--bottle-depth))`,
                  }}
                  transition={transition}
                  onAnimationComplete={index === active ? onSettled : undefined}
                  className="bottle-side"
                  style={{ "--face": index } as CSSProperties}
                  aria-label={`Bottle face ${index + 1}`}
                  aria-hidden={index !== active}
                  inert={index !== active || turning}
                >
                  <div className="glass-grain" aria-hidden="true" />
                  <div className="bottle-fluid" aria-hidden="true">
                    {Array.from({ length: 14 }, (_, i) => (
                      <i key={i} style={{ "--n": i } as CSSProperties} />
                    ))}
                  </div>
                  <div className="bottle-engraving" aria-hidden="true">
                    CANTINA / LABORATOIRE DU VIN
                  </div>
                  {faces[index]}
                  <div className="bottle-heel" aria-hidden="true">
                    <span>EST. MMXXVI</span>
                    <i />
                    <span>750 mL</span>
                  </div>
                </motion.section>
              </Fragment>
            ))}
            <div className="bottle-base" aria-hidden="true" />
          </div>
        </div>
      </div>
      {["left", "right"].map((edge) => (
        <div
          key={edge}
          className={`bottle-swipe-edge edge-${edge}`}
          aria-hidden="true"
          onPointerDown={(e) => {
            if (brewing || turning) return;
            origin.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            if (!origin.current) return;
            const direction = swipeTurn(
              e.clientX - origin.current.x,
              e.clientY - origin.current.y,
            );
            origin.current = null;
            if (direction) onTurn(direction);
          }}
          onPointerCancel={() => {
            origin.current = null;
          }}
        />
      ))}
    </div>
  );
}
