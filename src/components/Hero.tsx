import { CONTACTS, PHONE, PHONE_TEL } from "../data/contacts";
import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10">
      <Reveal>
        <h1 className="font-display text-xl font-black leading-[0.95] tracking-tight sm:text-2xl lg:text-3xl">
          <Scramble text="АЛЕКСЕЙ" delay={100} />
          <br />
          <Scramble text="ПРИПЛАД" delay={300} />
        </h1>
      </Reveal>

      <Reveal delay={150}>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone-dim sm:text-[11px]">
          DIRECTOR / VIDEOGRAPHER / AI VIDEO
        </p>
      </Reveal>

      <Reveal delay={250}>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-bone-dim sm:text-sm">
          Создаю видео с помощью AI-инструментов. От идеи до готового ролика — промпты, генерация, монтаж.
        </p>
      </Reveal>

      <Reveal delay={350}>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          <a
            href={PHONE_TEL}
            className="u-sweep border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[10px]"
          >
            {PHONE}
          </a>
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="u-sweep border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[10px]"
            >
              {c.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
