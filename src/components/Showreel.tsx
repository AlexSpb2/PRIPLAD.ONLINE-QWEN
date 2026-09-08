import { useState } from "react";
import { SHOWREEL } from "../data/videos";
import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";

export default function Showreel() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="showreel" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-8 border-b border-line pb-8 sm:mb-12">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone-dim">
              <span className="inline-block h-px w-10 bg-ember" aria-hidden />
              ШОУРИЛ'26
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              {SHOWREEL.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone-dim sm:text-base">
              {SHOWREEL.description}
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-video overflow-hidden border border-line bg-coal-950">
            {!isPlaying && (
              <>
                <img
                  src={SHOWREEL.poster}
                  alt={SHOWREEL.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-950/80 via-transparent to-transparent" />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Воспроизвести"
                >
                  <span className="flex h-20 w-20 items-center justify-center border-2 border-ember bg-coal-950/80 text-ember transition-all duration-300 group-hover:scale-110 group-hover:bg-coal-950 sm:h-24 sm:w-24">
                    <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 sm:h-10 sm:w-10" fill="currentColor" aria-hidden>
                      <path d="M7 4.5v15l13-7.5z" />
                    </svg>
                  </span>
                </button>
              </>
            )}
            {isPlaying && (
              <VideoPlayer
                url={SHOWREEL.videoUrl}
                poster={SHOWREEL.poster}
                autoPlay
                controls
                className="absolute inset-0 h-full w-full"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
