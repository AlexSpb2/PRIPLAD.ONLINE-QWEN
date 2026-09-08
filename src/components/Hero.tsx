import { CONTACTS } from "../data/contacts";
import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <Reveal>
        <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          <Scramble text="АЛЕКСЕЙ" delay={100} />
          <br />
          <Scramble text="ПРИПЛАД" delay={300} />
        </h1>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-bone-dim sm:text-base">
          DIRECTOR / VIDEOGRAPHER / AI VIDEO
        </p>
      </Reveal>

      <Reveal delay={400}>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-bone-dim sm:text-base">
          Создаю видео с помощью AI-инструментов. От идеи до готового ролика — промпты, генерация, монтаж.
        </p>
      </Reveal>

      <Reveal delay={500}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="u-sweep border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
            >
              {c.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
