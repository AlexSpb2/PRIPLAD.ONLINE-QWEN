import { useScrollProgress } from "./lib/hooks";
import { CONTACTS } from "./data/contacts";
import CTA from "./components/CTA";
import FeaturedWorks from "./components/FeaturedWorks";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Process from "./components/Process";
import Reveal from "./components/Reveal";
import Scramble from "./components/Scramble";
import Showreel from "./components/Showreel";
import Timecode from "./components/Timecode";

const NAV = [
  { href: "#showreel", label: "Шоурил" },
  { href: "#works", label: "Работы" },
  { href: "#process", label: "Процесс" },
  { href: "#contact", label: "Контакт" },
];

function Aperture({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M16 4.5v7.8M27 10.4l-6.8 3.9M27 21.6l-6.8-1.6M16 27.5l2.6-7.2M5 21.6l6.8-3.9M5 10.4l6.8 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3" fill="#ff5b45" />
    </svg>
  );
}

export default function App() {
  const progress = useScrollProgress();

  return (
    <div className="relative min-h-screen font-body text-bone">
      {/* фоновые слои */}
      <div className="ambient" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* ---------- шапка ---------- */}
      <header className="sticky top-0 z-50 border-b border-line bg-coal-950/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#showreel" className="group flex items-center gap-3 text-bone">
            <Aperture className="h-8 w-8 text-ember transition-transform duration-500 group-hover:rotate-90" />
            <span className="leading-none">
              <span className="block font-display text-lg font-black tracking-wide">ПРИПЛАД</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-bone-dim">
                AI video
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-xs uppercase tracking-[0.25em] text-bone-dim transition-colors hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 border border-line bg-coal-900 px-3 py-1.5">
            <span className="blink h-2 w-2 rounded-full bg-signal" aria-hidden />
            <Timecode className="text-xs text-ember-soft" />
          </div>
        </div>
        {/* прогресс чтения */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-ember transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </header>

      <main className="relative z-10">
        {/* ---------- HERO ---------- */}
        <Hero />

        {/* ---------- бегущая строка ---------- */}
        <Marquee />

        {/* ---------- ШОУРИЛ'26 ---------- */}
        <Showreel />

        {/* ---------- ИЗБРАННЫЕ РАБОТЫ ---------- */}
        <FeaturedWorks />

        {/* ---------- ОТ ИДЕИ ДО ГОТОВОГО ВИДЕО ---------- */}
        <Process />

        {/* ---------- CTA ---------- */}
        <CTA />
      </main>

      {/* ---------- подвал ---------- */}
      <footer className="relative z-10">
        <div className="perf" aria-hidden />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <Aperture className="h-7 w-7 text-ember" />
            <div>
              <p className="font-display text-base font-black leading-none">ПРИПЛАД</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                © 2026 · AI video production
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="text-left sm:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
              25 fps · Санкт-Петербург <Timecode className="text-ember-soft" />
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-wider text-coal-600">
              Съёмка — Санкт-Петербург. AI production + монтаж — worldwide.
            </p>
            <div className="mt-3 flex gap-4">
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="u-sweep font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
