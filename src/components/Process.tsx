import { PROCESS_STEPS } from "../data/process";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-t border-line bg-coal-900/40 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
        {/* sticky-колонка */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-ember">
            <span className="inline-block h-px w-10 bg-ember" aria-hidden />
            Процесс
          </p>
          <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
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
            <p className="mt-6 text-sm leading-relaxed text-bone-dim">
              Четыре этапа — от концепции до финального монтажа. На каждом шаге вы видите, что происходит, и контролируете результат.
            </p>
          </Reveal>
        </div>

        {/* шаги */}
        <ol className="border-t border-line">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <li className="group flex gap-6 border-b border-line py-8 transition-all duration-300 hover:bg-coal-900 hover:pl-4 sm:gap-10 sm:py-10">
                <span className="font-display text-4xl font-black leading-none text-coal-600 transition-colors duration-300 group-hover:text-ember sm:text-6xl">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold sm:text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone-dim">{s.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-coal-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim transition-colors group-hover:border-ember/50 group-hover:text-bone"
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
