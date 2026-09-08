import { PROCESS_STEPS } from "../data/process";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-14 border-t border-line bg-coal-900/40 py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        {/* sticky-колонка */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.35em] text-ember">
            <span className="inline-block h-px w-6 bg-ember" aria-hidden />
            Процесс
          </p>
          <h2 className="mt-2 font-display text-base font-black leading-tight tracking-tight sm:text-lg lg:text-xl">
            <Reveal variant="mask">
              <span>ОТ ИДЕИ ДО</span>
            </Reveal>
            <Reveal variant="mask" delay={120}>
              <span>
                ГОТОВОГО <span className="text-ember">ВИДЕО</span>
              </span>
            </Reveal>
          </h2>
          <Reveal delay={200}>
            <p className="mt-3 text-xs leading-relaxed text-bone-dim sm:text-sm">
              От концепции до финального монтажа — с контролем ключевых решений на каждом этапе.
            </p>
          </Reveal>
        </div>

        {/* шаги */}
        <ol className="border-t border-line">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 60}>
              <li className="group flex gap-4 border-b border-line py-4 transition-all duration-300 hover:bg-coal-900 hover:pl-2 sm:gap-6 sm:py-5">
                <span className="font-display text-lg font-black leading-none text-coal-600 transition-colors duration-300 group-hover:text-ember sm:text-xl">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display text-sm font-extrabold sm:text-base">{s.title}</h3>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-bone-dim sm:text-sm">{s.text}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-coal-700 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-bone-dim transition-colors group-hover:border-ember/50 group-hover:text-bone sm:text-[9px]"
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
