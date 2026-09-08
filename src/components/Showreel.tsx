import { useState } from "react";
import { SHOWREEL } from "../data/videos";
import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";

export default function Showreel() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="showreel" className="scroll-mt-14 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-6 border-b border-line pb-6 sm:mb-8">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-bone-dim">
              <span className="inline-block h-px w-8 bg-ember" aria-hidden />
              ШОУРИЛ'26
            </p>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              {SHOWREEL.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone-dim">
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
                  <span className="flex h-16 w-16 items-center justify-center border-2 border-ember bg-coal-950/80 text-ember transition-all duration-300 group-hover:scale-110 group-hover:bg-coal-950 sm:h-20 sm:w-20">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" aria-hidden>
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
