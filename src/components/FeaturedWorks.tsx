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
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedVideos = data.videos.filter((v) => v.published);

  // Если выбран формат — показываем все его видео
  // Иначе — первые 2 опубликованных видео каждого формата
  const displayVideos: Video[] = activeFormat
    ? publishedVideos
        .filter((v) => v.formatId === activeFormat)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : formats.flatMap((f) =>
        publishedVideos
          .filter((v) => v.formatId === f.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .slice(0, 2)
      );

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

          {/* Фильтр по форматам */}
          <Reveal delay={100}>
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFormat(null)}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  activeFormat === null
                    ? "border-ember bg-ember text-coal-950"
                    : "border-line text-bone-dim hover:text-bone"
                }`}
              >
                Все
              </button>
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFormat(f.id)}
                  className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    activeFormat === f.id
                      ? "border-ember bg-ember text-coal-950"
                      : "border-line text-bone-dim hover:text-bone"
                  }`}
                >
                  <FormatIcon formatName={f.name} className="h-3 w-3" />
                  {f.name}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayVideos.map((video, i) => (
              <Reveal key={video.id} delay={(i % 3) * 90}>
                <VideoCard video={video} onOpen={setLightbox} />
              </Reveal>
            ))}
          </div>

          {displayVideos.length === 0 && (
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
