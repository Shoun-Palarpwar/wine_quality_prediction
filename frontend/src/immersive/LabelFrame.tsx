import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { faceNames } from "./bottleState";

type Props = {
  face: number;
  turn: (direction: number) => void;
  locked: boolean;
  children: ReactNode;
};
export function LabelFrame({ face, turn, locked, children }: Props) {
  return (
    <div className={`cantina-label label-face-${face}`}>
      <div className="label-masthead">
        <span>CANTINA</span>
        <span>ÉDITION / 001</span>
      </div>
      <div className="label-content" data-lenis-prevent>
        {children}
      </div>
      <div className="label-navigation">
        <button
          aria-label="Rotate bottle right to previous face"
          disabled={locked}
          onClick={() => turn(-1)}
        >
          <ChevronLeft size={17} />
        </button>
        <div>
          <span>
            {String(face + 1).padStart(2, "0")} / {faceNames[face]}
          </span>
          <div className="label-face-dots" aria-hidden="true">
            {faceNames.map((name, index) => (
              <i key={name} className={face === index ? "current" : ""} />
            ))}
          </div>
        </div>
        <button
          aria-label="Rotate bottle left to next face"
          disabled={locked}
          onClick={() => turn(1)}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
