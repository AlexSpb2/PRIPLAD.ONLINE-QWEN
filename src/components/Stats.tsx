import { useCountUp, useInView } from "../lib/hooks";
import Reveal from "./Reveal";

interface StatDef {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: StatDef[] = [
  { value: 9, label: "лет за камерой и в монтажной" },
  { value: 127, label: "проектов в рабочем архиве" },
  { value: 3480, label: "часов отснятого материала" },
  { value: 18, label: "фестивальных показов и наград" },
];

function StatItem({ stat, start, delay }: { stat: StatDef; start: boolean; delay: number }) {
  const n = useCountUp(stat.value, start);
  return (
    <Reveal delay={delay} className="border-coal-700 px-6 py-8 sm:px-8 max-sm:border-t first:max-sm:border-t-0 [&:nth-child(odd)]:max-sm:border-r sm:border-l sm:first:border-l-0">
      <p className="font-display text-4xl font-extrabold tabular-nums text-ember sm:text-5xl">
        {n.toLocaleString("ru-RU")}
        {stat.suffix ?? ""}
      </p>
      <p className="mt-3 max-w-[180px] text-sm leading-snug text-bone-dim">{stat.label}</p>
    </Reveal>
  );
}

/** Полоса счётчиков с анимацией набора при появлении в кадре. */
export default function Stats() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div ref={ref} className="border-y border-coal-700 bg-coal-900/60">
      <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} start={inView} delay={i * 120} />
        ))}
      </div>
    </div>
  );
}
