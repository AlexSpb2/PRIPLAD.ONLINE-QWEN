import { CONTACTS, PHONE, PHONE_TEL } from "../data/contacts";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-lg font-black leading-[0.95] tracking-tight sm:text-xl lg:text-2xl">
            ЕСТЬ ИДЕЯ?
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-2 font-display text-sm font-bold text-ember sm:text-base lg:text-lg">
            ПРИДУМАЕМ, СОЗДАДИМ, СОБЕРЁМ.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <a
              href={PHONE_TEL}
              className="border border-line px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[11px]"
            >
              {PHONE}
            </a>
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="border border-line px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[11px]"
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
