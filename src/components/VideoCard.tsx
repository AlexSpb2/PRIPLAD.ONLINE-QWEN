import { useEffect, useRef, useState } from "react";
import type { VideoWork } from "../data/videos";

interface VideoCardProps {
  video: VideoWork;
  index: number;
  onOpen: (video: VideoWork) => void;
  onRemove?: () => void;
}

/** Карточка работы: постер, превью-воспроизведение при наведении, клик — лайтбокс. */
export default function VideoCard({ video, index, onOpen, onRemove }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArm] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
  }, []);

  const handleRemoveClick = () => {
    if (!onRemove) return;
    if (!confirming) {
      setConfirming(true);
      confirmTimer.current = setTimeout(() => setConfirming(false), 2600);
    } else {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      setConfirming(false);
      onRemove();
    }
  };

  const handleEnter = () => {
    if (!armed) setArm(true);
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <button
      onClick={() => onOpen(video)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-label={`Смотреть «${video.title}»`}
      className="group block w-full cursor-pointer border border-line bg-coal-900 text-left transition-all duration-300 hover:-translate-y-1 hover:border-ember/60 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-video overflow-hidden bg-coal-800">
        <img
          src={video.poster}
          alt={video.title}
          loading="lazy"
          className="poster-img h-full w-full object-cover"
        />
        {armed && (
          <video
            ref={videoRef}
            src={video.src}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* затемнение снизу */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-coal-950/90 via-coal-950/30 to-transparent" />

        {/* категория */}
        <span className="absolute left-3 top-3 border border-bone/25 bg-coal-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone">
          {video.category}
        </span>

        {/* номер в архиве + удаление своего ролика */}
        <span className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <span className="font-mono text-[11px] tracking-widest text-bone/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          {onRemove && (
            <span
              role="button"
              tabIndex={0}
              aria-label={confirming ? "Подтвердить удаление" : `Удалить «${video.title}»`}
              title={confirming ? "Нажмите ещё раз" : "Удалить из архива"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleRemoveClick();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveClick();
                }
              }}
              className={`flex h-6 min-w-6 cursor-pointer items-center justify-center border px-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                confirming
                  ? "border-signal bg-signal text-coal-950"
                  : "border-bone/25 bg-coal-950/70 text-bone-dim hover:border-signal hover:text-signal"
              }`}
            >
              {confirming ? (
                "точно?"
              ) : (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
                </svg>
              )}
            </span>
          )}
        </span>

        {/* хронометраж */}
        <span className="absolute bottom-3 right-3 bg-ember px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums text-coal-950">
          {video.duration}
        </span>

        {/* play в центре при наведении */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 scale-75 items-center justify-center border-2 border-ember bg-coal-950/75 text-ember opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </span>

        {/* название */}
        <span className="absolute inset-x-3 bottom-3">
          <span className="block font-display text-base font-semibold leading-snug text-bone sm:text-lg">
            {video.title}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-bone-dim">
            {video.client} · {video.year}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-bone-dim">{video.role}</span>
        <span className="ml-auto flex flex-wrap gap-1.5">
          {video.tags.slice(0, 2).map((t) => (
            <span key={t} className="bg-coal-800 px-2 py-0.5 text-[11px] text-bone-dim transition-colors group-hover:text-bone">
              #{t}
            </span>
          ))}
        </span>
      </div>
    </button>
  );
}
