import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Shell } from "./components/Shell";
import { useAtmosphere } from "./hooks/useAtmosphere";
import Cellar from "./pages/Cellar";
const Lab = lazy(() => import("./pages/Lab"));
const Outcome = lazy(() => import("./pages/Outcome"));
const Intelligence = lazy(() => import("./pages/Intelligence"));

export default function App() {
  useAtmosphere();
  const location = useLocation();
  const reduced = useReducedMotion();
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -6 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
        >
          <Suspense
            fallback={
              <div className="empty-state" role="status">
                <span className="eyebrow">OPENING THE CHAMBER…</span>
              </div>
            }
          >
            <Routes location={location}>
              <Route path="/" element={<Cellar />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/outcome" element={<Outcome />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route
                path="*"
                element={
                  <div className="empty-state">
                    <span className="eyebrow">404 / UNCHARTED CELLAR</span>
                    <h1>This vintage is missing.</h1>
                    <Link className="button-primary" to="/">
                      Return to the cellar
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}
