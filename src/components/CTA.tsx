import { CONTACTS } from "../data/contacts";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            ЕСТЬ ИДЕЯ?
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 font-display text-2xl font-bold text-ember sm:text-4xl lg:text-5xl">
            ПРИДУМАЕМ, СОЗДАДИМ, СОБЕРЁМ.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-ember bg-ember px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-coal-950 transition-all hover:-translate-y-1 hover:bg-ember-soft sm:text-base"
              >
                {c.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
