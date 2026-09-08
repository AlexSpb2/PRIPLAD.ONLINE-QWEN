import { CONTACTS, PHONE, PHONE_TEL } from "../data/contacts";
import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
      <Reveal>
        <h1 className="font-display text-2xl font-black leading-[0.95] tracking-tight sm:text-3xl lg:text-4xl">
          <Scramble text="АЛЕКСЕЙ" delay={100} />
          <br />
          <Scramble text="ПРИПЛАД" delay={300} />
        </h1>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim sm:text-xs">
          DIRECTOR / VIDEOGRAPHER / AI VIDEO
        </p>
      </Reveal>

      <Reveal delay={400}>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-dim">
          Создаю видео с помощью AI-инструментов. От идеи до готового ролика — промпты, генерация, монтаж.
        </p>
      </Reveal>

      <Reveal delay={500}>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <a
            href={PHONE_TEL}
            className="u-sweep border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[11px]"
          >
            {PHONE}
          </a>
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="u-sweep border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[11px]"
            >
              {c.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
