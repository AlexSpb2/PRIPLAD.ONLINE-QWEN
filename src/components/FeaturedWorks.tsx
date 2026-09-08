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
      <section id="works" className="scroll-mt-14 border-t border-line px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-6 border-b border-line pb-6 sm:mb-8">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-bone-dim">
                <span className="inline-block h-px w-8 bg-ember" aria-hidden />
                Работы
              </p>
              <h2 className="mt-3 font-display text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                РАБОТЫ
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
