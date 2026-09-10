import { PROCESS_STEPS } from "../data/process";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="scroll-mt-14 border-t border-line bg-coal-900/40 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-4 border-b border-line pb-4 sm:mb-5">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-bone-dim">
              <span className="inline-block h-px w-8 bg-ember" aria-hidden />
              Процесс
            </p>
            <h2 className="mt-2 font-display text-lg font-black tracking-tight sm:text-xl lg:text-2xl">
              От идеи до готового <span className="text-ember">видео</span>
            </h2>
          </div>
        </Reveal>

        {/* Storyboard */}
        <div className="relative">
          {/* SVG линия-траектория */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
            aria-hidden
          >
            <path
              d="M 60 40 Q 150 20, 240 50 T 420 45 Q 500 60, 580 40"
              fill="none"
              stroke="#3b3327"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Карточки этапов */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div
                  className="relative border border-line bg-coal-900 p-3 transition-all hover:border-ember/40 sm:p-4"
                  style={{
                    transform: `translateY(${i % 2 === 0 ? "0" : "8px"}) rotate(${i % 2 === 0 ? "-0.5" : "0.5"}deg)`,
                  }}
                >
                  {/* Номер */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold text-ember">
                      {step.num}
                    </span>
                    <div className="h-px flex-1 bg-line" />
                  </div>

                  {/* Заголовок */}
                  <h3 className="font-display text-sm font-bold leading-tight sm:text-base">
                    {step.title}
                  </h3>

                  {/* Описание */}
                  <p className="mt-1.5 text-xs leading-snug text-bone-dim sm:text-[11px]">
                    {step.text}
                  </p>

                  {/* Теги */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {step.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[8px] uppercase tracking-wider text-coal-600 sm:text-[9px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
