import { NavLink, Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Wine, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const navigation = [
  { to: "/", label: "The cellar", index: "01" },
  { to: "/lab", label: "Analysis lab", index: "02" },
  { to: "/intelligence", label: "Intelligence", index: "03" },
];
export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <div className="vault-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="CRU.AI home">
          <Wine size={23} strokeWidth={1.2} />
          <span>
            CRU<span className="brand-dot">.</span>AI
          </span>
          <span className="brand-divider" />
          <small>
            THE DIGITAL
            <br />
            SOMMELIER
          </small>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end>
              <span>{item.index}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <span className="status-label">
            <i /> MODEL v1.0
          </span>
          <Link to="/lab" className="header-cta">
            Enter the lab <ArrowUpRight size={15} />
          </Link>
        </div>
        <button
          className="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <NavLink to={item.to} key={item.to} end>
                {item.index} / {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <Link to="/" className="footer-wordmark">
          CRU.AI
        </Link>
        <span>ESTATE INTUITION. MACHINE PRECISION.</span>
        <span className="footer-end">
          UCI RED WINE DATASET <i /> RESEARCH EDITION / 001
        </span>
      </footer>
    </div>
  );
}
