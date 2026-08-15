import { useEffect } from "react";
import type { VideoWork } from "../data/videos";

interface LightboxProps {
  video: VideoWork;
  position: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** Модальный просмотр работы с деталями и листанием архива. */
export default function Lightbox({ video, position, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fade-in fixed inset-0 z-[80] flex items-center justify-center bg-coal-950/95 p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div
        className="lightbox-in relative max-h-full w-full max-w-4xl overflow-y-auto border border-coal-700 bg-coal-900 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* шапка */}
        <div className="flex items-center justify-between gap-4 border-b border-coal-700 px-5 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
            Архив · <span className="text-ember">{position}</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center border border-coal-600 text-bone transition-all hover:rotate-90 hover:border-signal hover:text-signal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        {/* видео */}
        <video
          key={video.id}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full bg-black"
        />

        {/* детали */}
        <div className="px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl font-extrabold text-bone sm:text-3xl">{video.title}</h3>
            <span className="bg-ember px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-coal-950">
              {video.category}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone-dim">{video.desc}</p>

          <dl className="mt-6 grid grid-cols-2 gap-px border border-coal-700 bg-coal-700 sm:grid-cols-4">
            {[
              ["Клиент", video.client],
              ["Год", String(video.year)],
              ["Роль", video.role],
              ["Хронометраж", video.duration],
            ].map(([k, v]) => (
              <div key={k} className="bg-coal-850 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">{k}</dt>
                <dd className="mt-1 text-sm font-semibold text-bone">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {video.tags.map((t) => (
                <span key={t} className="border border-coal-600 px-2.5 py-1 text-xs text-bone-dim">
                  #{t}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPrev}
                className="flex items-center gap-2 border border-coal-600 px-4 py-2 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:border-ember hover:text-ember"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M19 12H5m6-7-7 7 7 7" strokeLinecap="square" />
                </svg>
                Пред.
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-2 border border-ember bg-ember px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-coal-950 transition-colors hover:bg-ember-soft"
              >
                След.
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M5 12h14m-6-7 7 7-7 7" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
