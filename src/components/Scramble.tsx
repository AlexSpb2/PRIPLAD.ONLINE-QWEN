import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../lib/hooks";

const GLYPHS = "КАДРЖШЩФ#/\\%&@$012345789";

interface ScrambleProps {
  text: string;
  className?: string;
  /** задержка старта, мс */
  delay?: number;
}

/** Заголовок, который «расшифровывается» из шума глифов. */
export default function Scramble({ text, className = "", delay = 0 }: ScrambleProps) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(() => (reduced ? text : ""));
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame.current += 1;
        const settled = Math.floor(frame.current / 3);
        if (settled >= text.length) {
          setOut(text);
          if (interval) clearInterval(interval);
          return;
        }
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") { s += " "; continue; }
          s += i < settled ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
      }, 42);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, reduced, delay]);

  return (
    <span className={className} aria-label={text}>
      {out || "\u00A0"}
    </span>
  );
}
