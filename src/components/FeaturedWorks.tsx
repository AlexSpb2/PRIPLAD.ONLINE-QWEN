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
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);

  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedVideos = data.videos.filter((v) => v.published);
  const selectedFormat = selectedFormatId ? formats.find((f) => f.id === selectedFormatId) : null;

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
            </div>
          </Reveal>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedFormatId(null)}
              className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                selectedFormatId === null
                  ? "border-ember bg-ember text-coal-950"
                  : "border-line text-bone-dim hover:border-ember/60 hover:text-bone"
              }`}
            >
              Все работы
            </button>
            {formats.map((format) => (
              <button
                key={format.id}
                type="button"
                onClick={() => setSelectedFormatId(format.id)}
                className={`flex items-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  selectedFormatId === format.id
                    ? "border-ember bg-ember text-coal-950"
                    : "border-line text-bone-dim hover:border-ember/60 hover:text-bone"
                }`}
              >
                <FormatIcon icon={format.icon} formatName={format.name} className="h-3.5 w-3.5" />
                {format.name}
              </button>
            ))}
          </div>

          {selectedFormat ? (
            <FormatSection
              format={selectedFormat}
              videos={publishedVideos
                .filter((v) => v.formatId === selectedFormat.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)}
              onOpen={setLightbox}
            />
          ) : (
            <div className="space-y-10">
              {formats.map((format) => {
                const videos = publishedVideos
                  .filter((v) => v.formatId === format.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .slice(0, 2);
                if (videos.length === 0) return null;
                return <FormatSection key={format.id} format={format} videos={videos} onOpen={setLightbox} />;
              })}
            </div>
          )}

          {publishedVideos.length === 0 && (
            <p className="mt-8 text-center font-mono text-sm text-coal-600">Нет опубликованных видео</p>
          )}
        </div>
      </section>

      {lightbox && <Lightbox video={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function FormatSection({
  format,
  videos,
  onOpen,
}: {
  format: { id: string; name: string; icon: string };
  videos: Video[];
  onOpen: (video: Video) => void;
}) {
  return (
    <div>
      <Reveal>
        <button
          type="button"
          onClick={() => onOpen(videos[0])}
          className="mb-4 flex items-center gap-2 border-b border-line pb-3 text-left"
        >
          <FormatIcon icon={format.icon} formatName={format.name} className="h-4 w-4 text-ember" />
          <h3 className="font-display text-lg font-bold sm:text-xl">{format.name}</h3>
        </button>
      </Reveal>

      {videos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={(i % 3) * 90}>
              <VideoCard video={video} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
