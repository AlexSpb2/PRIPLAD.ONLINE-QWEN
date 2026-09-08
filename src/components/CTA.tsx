import { CONTACTS, PHONE, PHONE_TEL } from "../data/contacts";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-base font-black leading-[0.95] tracking-tight sm:text-lg lg:text-xl">
            ЕСТЬ ИДЕЯ?
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-2 font-display text-xs font-bold text-ember sm:text-sm lg:text-base">
            ПРИДУМАЕМ, СОЗДАДИМ, СОБЕРЁМ.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            <a
              href={PHONE_TEL}
              className="border border-line px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[10px]"
            >
              {PHONE}
            </a>
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="border border-line px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-bone transition-all hover:border-ember hover:text-ember sm:text-[10px]"
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
