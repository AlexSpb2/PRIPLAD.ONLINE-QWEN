import { useApp } from "../store/AppContext";
import { useScrollProgress } from "../lib/hooks";
import { CONTACTS, PHONE } from "../data/contacts";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Showreel from "../components/Showreel";
import FeaturedWorks from "../components/FeaturedWorks";
import Process from "../components/Process";
import CTA from "../components/CTA";
import Timecode from "../components/Timecode";

const NAV = [
  { href: "#showreel", label: "Шоурил" },
  { href: "#works", label: "Работы" },
  { href: "#process", label: "Процесс" },
  { href: "#contact", label: "Контакт" },
];

function Aperture({ className = "h-7 w-7" }: { className?: string }) {
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

export default function PublicPage() {
  const { data, loading } = useApp();
  const progress = useScrollProgress();

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal-950">
        <p className="font-mono text-sm text-bone-dim">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-body text-bone">
      {/* фоновые слои */}
      <div className="ambient" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* ---------- шапка ---------- */}
      <header className="sticky top-0 z-50 border-b border-line bg-coal-950/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#showreel" className="group flex items-center gap-2.5 text-bone">
            <Aperture className="h-7 w-7 text-ember transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim">
              AI VIDEO
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim transition-colors hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 border border-line bg-coal-900 px-2.5 py-1.5">
            <span className="blink h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            <Timecode className="text-[11px] text-ember-soft" />
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

        {/* ---------- РАБОТЫ ---------- */}
        <FeaturedWorks />

        {/* ---------- ОТ ИДЕИ ДО ГОТОВОГО ВИДЕО ---------- */}
        <Process />

        {/* ---------- CTA ---------- */}
        <CTA />
      </main>

      {/* ---------- подвал ---------- */}
      <footer className="relative z-10">
        <div className="perf" aria-hidden />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <Aperture className="h-6 w-6 text-ember" />
            <div>
              <p className="font-display text-sm font-black leading-none">АЛЕКСЕЙ ПРИПЛАД</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                DIRECTOR / VIDEOGRAPHER / AI VIDEO
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-5">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="text-left sm:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Съёмка — Санкт-Петербург
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              AI production + монтаж — worldwide
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="tel:9112090801"
                className="u-sweep font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
              >
                {PHONE}
              </a>
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="u-sweep font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
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
