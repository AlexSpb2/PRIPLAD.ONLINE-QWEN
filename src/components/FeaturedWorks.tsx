import { useState } from "react";
import { useApp } from "../store/AppContext";
import type { Video } from "../types";
import Reveal from "./Reveal";
import VideoCard from "./VideoCard";
import Lightbox from "./Lightbox";
import FormatIcon from "./FormatIcon";

export default function FeaturedWorks() {
  const { data } = useApp();
  const [lightbox, setLightbox] = useState<Video | null>(null);

  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedVideos = data.videos.filter((v) => v.published);

  return (
    <>
      <section id="works" className="scroll-mt-14 border-t border-line px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-6 border-b border-line pb-6 sm:mb-8">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-bone-dim">
                <span className="inline-block h-px w-8 bg-ember" aria-hidden />
                ИЗБРАННОЕ
              </p>
              <h2 className="mt-3 font-display text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                РАБОТЫ
              </h2>
            </div>
          </Reveal>

          {/* Группировка по форматам */}
          {formats.map((format) => {
            const formatVideos = publishedVideos
              .filter((v) => v.formatId === format.id)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            if (formatVideos.length === 0) return null;

            return (
              <div key={format.id} className="mb-10 last:mb-0">
                <Reveal>
                  <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
                    <FormatIcon formatName={format.name} className="h-4 w-4 text-ember" />
                    <h3 className="font-display text-lg font-bold sm:text-xl">{format.name}</h3>
                  </div>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {formatVideos.map((video, i) => (
                    <Reveal key={video.id} delay={(i % 3) * 90}>
                      <VideoCard video={video} onOpen={setLightbox} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}

          {publishedVideos.length === 0 && (
            <p className="mt-8 text-center font-mono text-sm text-coal-600">
              Нет опубликованных видео
            </p>
          )}
        </div>
      </section>

      {lightbox && (
        <Lightbox video={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
