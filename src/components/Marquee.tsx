import { TOOLS } from "../data/tools";

function Diamond() {
  return (
    <svg viewBox="0 0 12 12" className="mx-4 h-2 w-2 shrink-0 self-center text-ember" aria-hidden>
      <path d="M6 0l6 6-6 6L0 6z" fill="currentColor" />
    </svg>
  );
}

/** Бегущая строка с AI-инструментами. Пауза при наведении. */
export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {TOOLS.map((tool) => (
        <span key={`${key}-${tool}`} className="flex items-center">
          <span className="font-display text-xs font-semibold tracking-[0.3em] text-bone-dim whitespace-nowrap">
            {tool}
          </span>
          <Diamond />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line bg-coal-900 py-3">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
