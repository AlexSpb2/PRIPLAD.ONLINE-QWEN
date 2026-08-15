import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../lib/hooks";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

/** Живой таймкод HH:MM:SS:FF (25 fps), как на мониторе камеры. */
export default function Timecode({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [tc, setTc] = useState("00:00:00:00");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const f = Math.floor((d.getMilliseconds() / 1000) * 25);
      setTc(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(f)}`);
    };
    tick();
    const id = setInterval(tick, reduced ? 1000 : 40);
    return () => clearInterval(id);
  }, [reduced]);

  return <span className={`font-mono tabular-nums tracking-wider ${className}`}>{tc}</span>;
}
