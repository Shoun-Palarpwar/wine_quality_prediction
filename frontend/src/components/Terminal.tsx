import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const message = "Welcome, sommelier. Your next discovery awaits.";
export function Terminal() {
  const [length, setLength] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setLength(message.length);
      return;
    }
    const timer = window.setInterval(
      () =>
        setLength((value) => {
          if (value >= message.length) window.clearInterval(timer);
          return Math.min(value + 1, message.length);
        }),
      38,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);
  return (
    <div className="terminal-line" aria-label={message}>
      <span aria-hidden="true">&gt;_</span>
      <span aria-hidden="true">
        {message.slice(0, length)}
        <i className="terminal-cursor" />
      </span>
    </div>
  );
}
