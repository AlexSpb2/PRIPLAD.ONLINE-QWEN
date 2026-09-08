import { useState, useEffect } from "react";
import { useApp } from "../store/AppContext";
import type { Video } from "../types";

interface VideoFormProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoForm({ video, onClose }: VideoFormProps) {
  const { data, addVideo, updateVideo } = useApp();
  const isEditing = !!video;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [poster, setPoster] = useState("");
  const [formatId, setFormatId] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setVideoUrl(video.videoUrl);
      setPoster(video.poster);
      setFormatId(video.formatId);
      setPublished(video.published);
    } else if (data && data.formats.length > 0) {
      setFormatId(data.formats[0].id);
    }
  }, [video, data]);

  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl || !formatId) return;

    setSaving(true);
    try {
      if (isEditing && video) {
        await updateVideo(video.id, {
          title,
          description,
          videoUrl,
          poster,
          formatId,
          published,
        });
      } else {
        const maxSort = Math.max(0, ...data.videos.filter((v) => v.formatId === formatId).map((v) => v.sortOrder));
        await addVideo({
          title,
          description,
          videoUrl,
          poster,
          formatId,
          sortOrder: maxSort + 1,
          published,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-coal-950/95 p-4">
      <div className="w-full max-w-lg overflow-y-auto border border-coal-700 bg-coal-900">
        <div className="flex items-center justify-between border-b border-coal-700 px-5 py-3">
          <h3 className="font-display text-base font-bold">
            {isEditing ? "Редактировать видео" : "Новое видео"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-coal-600 text-bone hover:border-signal hover:text-signal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Название *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              URL видео *
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              placeholder="YouTube, Vimeo, VK, RuTube или прямой .mp4"
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 font-mono text-xs text-bone focus:border-ember focus:outline-none"
            />
            <p className="mt-1 font-mono text-[9px] text-coal-600">
              Поддержка: YouTube, Vimeo, RuTube, VK (video_ext.php), прямые файлы
            </p>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              URL постера
            </label>
            <input
              type="url"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://..."
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 font-mono text-xs text-bone focus:border-ember focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Формат *
            </label>
            <select
              value={formatId}
              onChange={(e) => setFormatId(e.target.value)}
              required
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
            >
              {formats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.icon} {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-ember"
              />
              <span className="font-mono text-xs uppercase tracking-wider text-bone-dim">
                Опубликовано
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-coal-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-bone-dim hover:border-bone-dim hover:text-bone"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-ember px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-coal-950 hover:bg-ember-soft disabled:opacity-60"
            >
              {saving ? "Сохранение..." : isEditing ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
