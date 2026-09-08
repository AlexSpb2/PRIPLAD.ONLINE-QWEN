import { PROCESS_STEPS } from "../data/process";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-14 border-t border-line bg-coal-900/40 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        {/* sticky-колонка */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-ember">
            <span className="inline-block h-px w-8 bg-ember" aria-hidden />
            Процесс
          </p>
          <h2 className="mt-3 font-display text-xl font-black leading-tight tracking-tight sm:text-2xl lg:text-3xl">
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
            <p className="mt-4 text-sm leading-relaxed text-bone-dim">
              От концепции до финального монтажа — с контролем ключевых решений на каждом этапе.
            </p>
          </Reveal>
        </div>

        {/* шаги */}
        <ol className="border-t border-line">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <li className="group flex gap-5 border-b border-line py-6 transition-all duration-300 hover:bg-coal-900 hover:pl-3 sm:gap-8 sm:py-7">
                <span className="font-display text-2xl font-black leading-none text-coal-600 transition-colors duration-300 group-hover:text-ember sm:text-3xl">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display text-base font-extrabold sm:text-lg">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone-dim">{s.text}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-coal-700 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-bone-dim transition-colors group-hover:border-ember/50 group-hover:text-bone"
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
