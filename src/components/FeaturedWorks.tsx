import { useState } from "react";
import { FEATURED_WORKS } from "../data/videos";
import type { Video } from "../data/videos";
import Reveal from "./Reveal";
import VideoCard from "./VideoCard";
import Lightbox from "./Lightbox";

export default function FeaturedWorks() {
  const [lightbox, setLightbox] = useState<Video | null>(null);

  return (
    <>
      <section id="works" className="scroll-mt-20 border-t border-line px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-8 border-b border-line pb-8 sm:mb-12">
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone-dim">
                <span className="inline-block h-px w-10 bg-ember" aria-hidden />
                Избранные работы
              </p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                ИЗБРАННЫЕ РАБОТЫ
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_WORKS.map((video, i) => (
              <Reveal key={video.id} delay={(i % 3) * 90}>
                <VideoCard video={video} onOpen={setLightbox} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox video={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
