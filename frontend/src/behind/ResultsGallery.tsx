import { useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import research from "./research.json";
export function ResultsGallery() {
  const [category, setCategory] = useState("Research");
  const [selected, setSelected] = useState(research.assets[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="research-gallery">
      <div
        className="research-filters"
        role="group"
        aria-label="Filter project artifacts"
      >
        {["Research", "Interface", "Archive"].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
            <span>
              {research.assets.filter((a) => a.category === c).length}
            </span>
          </button>
        ))}
      </div>
      <p className="artifact-note">
        {category === "Archive"
          ? "Historical first-run plots. These are not the current model’s evaluation."
          : category === "Interface"
            ? "Original JPG captures of the earlier CRU.AI interface, retained as design history."
            : "Original, unmodified plots from the current reproducible pipeline. Open a figure to inspect it at full size."}
      </p>
      <div className="research-image-grid">
        {research.assets
          .filter((a) => a.category === category)
          .map((a, i) => (
            <button
              className="research-figure"
              key={a.src}
              onClick={() => {
                setSelected(a);
                dialog.current?.showModal();
              }}
            >
              <div>
                <img
                  src={a.src}
                  alt={a.name}
                  loading="lazy"
                  width="900"
                  height="675"
                />
              </div>
              <span>
                <small>FIG. {String(i + 1).padStart(2, "0")}</small>
                {a.name}
                <ArrowUpRight size={18} />
              </span>
            </button>
          ))}
      </div>
      <dialog
        ref={dialog}
        aria-label="Project figure viewer"
        className="research-lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        data-lenis-prevent
      >
        <div>
          <header>
            <span>{selected.name}</span>
            <button
              aria-label="Close figure"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </header>
          <img src={selected.src} alt={selected.name} />
          <footer>
            <span>{selected.source}</span>
            <a href={selected.src} target="_blank" rel="noreferrer">
              Open original <ArrowUpRight size={15} />
            </a>
          </footer>
        </div>
      </dialog>
    </div>
  );
}
