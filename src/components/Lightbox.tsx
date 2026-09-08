import { useEffect } from "react";
import type { Video } from "../types";
import VideoPlayer from "./VideoPlayer";

interface LightboxProps {
  video: Video;
  onClose: () => void;
}

/** Модальный просмотр работы. */
export default function Lightbox({ video, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

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
            Избранные работы
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
        <VideoPlayer
          url={video.videoUrl}
          poster={video.poster}
          autoPlay
          controls
          className="aspect-video w-full bg-black"
        />

        {/* детали */}
        <div className="px-5 py-5 sm:px-7">
          <h3 className="font-display text-2xl font-extrabold text-bone sm:text-3xl">{video.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone-dim">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
