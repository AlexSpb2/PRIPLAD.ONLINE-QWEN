const ITEMS = [
  "РЕКЛАМА",
  "АНИМАЦИЯ",
  "РЕПОРТАЖ",
  "АЭРОСЪЁМКА",
  "МОНТАЖ",
  "ЦВЕТОКОРРЕКЦИЯ",
  "САУНД-ДИЗАЙН",
  "ИНТЕРВЬЮ",
  "ТРЕЙЛЕРЫ",
  "КЛИПЫ",
];

function Diamond() {
  return (
    <svg viewBox="0 0 12 12" className="mx-6 h-2.5 w-2.5 shrink-0 self-center text-ember" aria-hidden>
      <path d="M6 0l6 6-6 6L0 6z" fill="currentColor" />
    </svg>
  );
}

/** Бегущая строка-титры с направлениями продакшна. Пауза при наведении. */
export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {ITEMS.map((item) => (
        <span key={`${key}-${item}`} className="flex items-center">
          <span className="font-display text-sm font-semibold tracking-[0.3em] text-bone-dim whitespace-nowrap">
            {item}
          </span>
          <Diamond />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line bg-coal-900 py-4">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
