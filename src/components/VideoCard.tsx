import { useRef, useState } from "react";
import type { Video } from "../types";

interface VideoCardProps {
  video: Video;
  onOpen: (video: Video) => void;
}

/**
 * Определяет, является ли URL прямым видеофайлом.
 */
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(url);
}

/** Карточка работы: постер, превью-воспроизведение при наведении (только для прямых видео), клик — лайтбокс. */
export default function VideoCard({ video, onOpen }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArm] = useState(false);
  const canHoverPreview = isDirectVideo(video.videoUrl);

  const handleEnter = () => {
    if (!canHoverPreview) return;
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
      className="group block w-full cursor-pointer border border-line bg-coal-900 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/60 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-video overflow-hidden bg-coal-800">
        <img
          src={video.poster}
          alt={video.title}
          loading="lazy"
          className="poster-img h-full w-full object-cover"
        />
        {canHoverPreview && armed && (
          <video
            ref={videoRef}
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* затемнение снизу */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-coal-950/90 via-coal-950/30 to-transparent" />

        {/* play в центре при наведении */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 scale-75 items-center justify-center border-2 border-ember bg-coal-950/75 text-ember opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </span>

        {/* название и описание */}
        <span className="absolute inset-x-3 bottom-3">
          <span className="block font-display text-sm font-semibold leading-snug text-bone sm:text-base">
            {video.title}
          </span>
          <span className="mt-1 line-clamp-2 block text-xs text-bone-dim">
            {video.description}
          </span>
        </span>
      </div>
    </button>
  );
}
