import { CONTACTS, PHONE, PHONE_TEL } from "../data/contacts";
import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
      <Reveal>
        <h1 className="font-display text-3xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
          <Scramble text="АЛЕКСЕЙ" delay={100} />
          <br />
          <Scramble text="ПРИПЛАД" delay={300} />
        </h1>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-bone-dim sm:text-sm">
          DIRECTOR / VIDEOGRAPHER / AI VIDEO
        </p>
      </Reveal>

      <Reveal delay={400}>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-dim">
          Создаю видео с помощью AI-инструментов. От идеи до готового ролика — промпты, генерация, монтаж.
        </p>
      </Reveal>

      <Reveal delay={500}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={PHONE_TEL}
            className="u-sweep border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
          >
            {PHONE}
          </a>
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="u-sweep border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
            >
              {c.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
