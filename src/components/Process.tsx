import { PROCESS_STEPS } from "../data/process";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-14 border-t border-line bg-coal-900/40 py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        {/* sticky-колонка */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember">
            Процесс
          </p>
          <h2 className="mt-2 font-display text-base font-bold leading-tight tracking-tight sm:text-lg lg:text-xl">
            <Reveal variant="mask">
              <span>От идеи до</span>
            </Reveal>
            <Reveal variant="mask" delay={100}>
              <span>
                готового <span className="text-ember">видео</span>
              </span>
            </Reveal>
          </h2>
          <Reveal delay={150}>
            <p className="mt-3 text-xs leading-relaxed text-bone-dim sm:text-sm">
              От концепции до финального монтажа — с контролем ключевых решений на каждом этапе.
            </p>
          </Reveal>
        </div>

        {/* шаги */}
        <ol className="border-t border-line">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 60}>
              <li className="flex gap-4 border-b border-line py-4 sm:gap-6 sm:py-5">
                <span className="font-mono text-xs font-semibold text-coal-600 sm:text-sm">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-body text-sm font-semibold sm:text-base">{s.title}</h3>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-bone-dim sm:text-sm">
                    {s.text}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[8px] uppercase tracking-wider text-coal-600 sm:text-[9px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
