import { CONTACTS } from "../data/contacts";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-black leading-[0.95] tracking-tight sm:text-3xl lg:text-4xl">
            ЕСТЬ ИДЕЯ?
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-4 font-display text-lg font-bold text-ember sm:text-xl lg:text-2xl">
            ПРИДУМАЕМ, СОЗДАДИМ, СОБЕРЁМ.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-ember bg-ember px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 transition-all hover:-translate-y-0.5 hover:bg-ember-soft sm:text-sm"
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
