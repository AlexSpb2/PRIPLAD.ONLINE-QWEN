import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoWork } from "../data/videos";
import Timecode from "./Timecode";

interface StageProps {
  video: VideoWork;
  queue: VideoWork[];
  onSelect: (id: string) => void;
  onEnded: () => void;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "00:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

/** Главная «просмотровая»: плеер-видоискатель + очередь работ справа. */
export default function Stage({ video, queue, onSelect, onEnded }: StageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setCurrent(0);
    setDuration(0);
    setMuted(true);
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => setPlaying(false));
  }, [video.id]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const t = trackRef.current;
    if (!v || !t || !duration) return;
    const rect = t.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
    setCurrent(v.currentTime);
  };

  const fullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
      {/* ------- плеер ------- */}
      <div>
        <div
          ref={frameRef}
          className="group/player relative border border-coal-700 bg-coal-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        >
          {/* углы-видоискатель */}
          <span className="tick left-2 top-2 border-l-2 border-t-2" />
          <span className="tick right-2 top-2 border-r-2 border-t-2" />
          <span className="tick bottom-2 left-2 border-b-2 border-l-2" />
          <span className="tick bottom-2 right-2 border-b-2 border-r-2" />

          {/* верхняя служебная строка */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-bone/90">
              <span className="blink inline-block h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_10px_2px_rgba(255,91,69,0.7)]" />
              REC&nbsp;·&nbsp;PREVIEW
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-bone/70">
              TC&nbsp;<Timecode className="text-ember-soft" />
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden bg-black">
            <video
              ref={videoRef}
              key={video.id}
              src={video.src}
              poster={video.poster}
              className="h-full w-full object-contain"
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={onEnded}
              onClick={togglePlay}
            />

            {/* кнопка play по центру */}
            {!playing && (
              <button
                onClick={togglePlay}
                aria-label="Смотреть"
                className="absolute inset-0 z-10 flex items-center justify-center bg-coal-950/30 transition-colors hover:bg-coal-950/15"
              >
                <span className="flex h-20 w-20 items-center justify-center border-2 border-ember bg-coal-950/80 text-ember transition-transform duration-300 hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
              </button>
            )}
          </div>

          {/* панель управления */}
          <div className="flex items-center gap-3 border-t border-coal-700 bg-coal-900 px-4 py-3 sm:gap-4">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Пауза" : "Смотреть"}
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-coal-600 text-bone transition-colors hover:border-ember hover:text-ember"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              )}
            </button>

            <span className="font-mono text-xs tabular-nums text-bone-dim">
              {fmt(current)} <span className="text-coal-600">/</span> {fmt(duration)}
            </span>

            <div
              ref={trackRef}
              onClick={seek}
              role="slider"
              aria-label="Перемотка"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              className="group/track relative h-5 flex-1 cursor-pointer"
            >
              <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-coal-700 transition-all group-hover/track:h-[5px]">
                <div className="relative h-full bg-ember" style={{ width: `${progress}%` }}>
                  <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-ember opacity-0 transition-opacity group-hover/track:opacity-100" />
                </div>
              </div>
            </div>

            <button
              onClick={toggleMute}
              aria-label={muted ? "Включить звук" : "Выключить звук"}
              className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${
                muted ? "border-coal-600 text-bone-dim hover:border-ember hover:text-ember" : "border-ember text-ember"
              }`}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4zM16 9l6 6M22 9l-6 6" strokeLinecap="square" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="square" />
                </svg>
              )}
            </button>

            <button
              onClick={fullscreen}
              aria-label="Во весь экран"
              className="hidden h-9 w-9 shrink-0 items-center justify-center border border-coal-600 text-bone-dim transition-colors hover:border-ember hover:text-ember sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="square" />
              </svg>
            </button>
          </div>
        </div>

        {/* подпись под плеером */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">
              Сейчас в просмотровой
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {video.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone-dim">{video.desc}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <span className="border border-ember/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ember">
              {video.category}
            </span>
            <span className="border border-coal-600 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bone-dim">
              {video.year}
            </span>
            <span className="hidden border border-coal-600 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-bone-dim sm:inline">
              {video.duration}
            </span>
          </div>
        </div>
      </div>

      {/* ------- очередь ------- */}
      <aside className="flex flex-col border border-coal-700 bg-coal-850">
        <div className="flex items-center justify-between border-b border-coal-700 px-5 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
            Очередь просмотра
          </span>
          <span className="font-mono text-[11px] text-ember">{String(queue.length).padStart(2, "0")}</span>
        </div>
        <ul className="flex-1 divide-y divide-coal-700/70">
          {queue.map((q, i) => {
            const active = q.id === video.id;
            return (
              <li key={q.id}>
                <button
                  onClick={() => onSelect(q.id)}
                  className={`group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 hover:bg-coal-800 hover:pl-6 ${
                    active ? "border-l-2 border-ember bg-coal-800" : "border-l-2 border-transparent"
                  }`}
                >
                  <span className={`font-mono text-xs ${active ? "text-ember" : "text-coal-600 group-hover:text-bone-dim"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-semibold ${active ? "text-ember-soft" : "text-bone"}`}>
                      {q.title}
                    </span>
                    <span className="block truncate font-mono text-[11px] uppercase tracking-wider text-bone-dim">
                      {q.category} · {q.duration}
                    </span>
                  </span>
                  {active ? (
                    <span className="flex items-end gap-[3px]" aria-hidden>
                      <span className="eq-bar h-3 w-[3px] bg-ember" style={{ animationDelay: "0ms" }} />
                      <span className="eq-bar h-3 w-[3px] bg-ember" style={{ animationDelay: "150ms" }} />
                      <span className="eq-bar h-3 w-[3px] bg-ember" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-coal-600 transition-all group-hover:translate-x-0.5 group-hover:text-ember" fill="currentColor" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-coal-700 px-5 py-4">
          <p className="font-mono text-[11px] leading-relaxed tracking-wider text-bone-dim">
            АВТОПЕРЕХОД К СЛЕДУЮЩЕЙ РАБОТЕ ПО ОКОНЧАНИИ РОЛИКА
          </p>
        </div>
      </aside>
    </div>
  );
}
