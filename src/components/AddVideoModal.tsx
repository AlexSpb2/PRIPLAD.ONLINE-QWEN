import { useEffect, useRef, useState } from "react";
import type { Category } from "../data/videos";
import { CATEGORIES } from "../data/videos";
import { analyzeVideo, formatFileSize, makeFallbackPoster } from "../lib/videoStore";

export interface NewVideoData {
  file?: File;
  url?: string;
  title: string;
  category: Category;
  client: string;
  desc: string;
  poster: string;
  duration: string;
}

interface AddVideoModalProps {
  onClose: () => void;
  onAdd: (data: NewVideoData) => Promise<void> | void;
}

const CATS = CATEGORIES.filter((c): c is Category => c !== "Все");

const inputCls =
  "w-full border border-coal-600 bg-coal-950 px-4 py-2.5 text-sm text-bone placeholder:text-coal-600 transition-colors focus:border-ember focus:outline-none";

/** Модалка добавления своего ролика: файл с устройства или прямая ссылка. */
export default function AddVideoModal({ onClose, onAdd }: AddVideoModalProps) {
  const [tab, setTab] = useState<"file" | "url">("file");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [poster, setPoster] = useState("");
  const [duration, setDuration] = useState("—:—");
  const [analyzing, setAnalyzing] = useState(false);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Моё");
  const [client, setClient] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempUrlRef = useRef<string>("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (tempUrlRef.current) URL.revokeObjectURL(tempUrlRef.current);
    };
  }, [onClose]);

  const acceptFile = async (f: File | undefined | null) => {
    setError("");
    if (!f) return;
    const isVideo = f.type.startsWith("video/") || /\.(mp4|webm|mov|m4v|ogv)$/i.test(f.name);
    if (!isVideo) {
      setError("Похоже, это не видео. Подойдут MP4, WebM или MOV.");
      return;
    }
    if (tempUrlRef.current) URL.revokeObjectURL(tempUrlRef.current);
    const objectUrl = URL.createObjectURL(f);
    tempUrlRef.current = objectUrl;
    setFile(f);
    setAnalyzing(true);
    const meta = await analyzeVideo(objectUrl, title.trim() || f.name.replace(/\.[^.]+$/, ""), category);
    setPoster(meta.poster);
    setDuration(meta.duration);
    setAnalyzing(false);
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("Укажите название ролика.");
      return;
    }
    if (tab === "file" && !file) {
      setError("Выберите видеофайл.");
      return;
    }
    if (tab === "url" && !/^https?:\/\/\S+$/i.test(url.trim())) {
      setError("Вставьте прямую ссылку, например https://…/rolik.mp4");
      return;
    }
    setBusy(true);
    try {
      const finalPoster =
        tab === "file" && poster
          ? poster
          : makeFallbackPoster(title.trim(), category);
      await onAdd({
        file: tab === "file" ? file ?? undefined : undefined,
        url: tab === "url" ? url.trim() : undefined,
        title: title.trim(),
        category,
        client: client.trim(),
        desc: desc.trim(),
        poster: finalPoster,
        duration: tab === "file" ? duration : "—:—",
      });
    } finally {
      setBusy(false);
    }
  };

  const tabBtn = (key: "file" | "url", label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`relative px-1 pb-3 font-mono text-xs uppercase tracking-[0.25em] transition-colors ${
        tab === key ? "text-ember" : "text-bone-dim hover:text-bone"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-0 bottom-0 h-0.5 bg-ember transition-transform duration-300 ${
          tab === key ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );

  return (
    <div
      className="fade-in fixed inset-0 z-[85] flex items-center justify-center bg-coal-950/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Добавить ролик"
    >
      <div
        className="lightbox-in relative max-h-full w-full max-w-2xl overflow-y-auto border border-coal-700 bg-coal-900 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* шапка */}
        <div className="flex items-center justify-between border-b border-coal-700 px-6 py-4">
          <div>
            <h3 className="font-display text-xl font-extrabold text-bone">НОВЫЙ РОЛИК</h3>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              попадёт в ваш архив на этом сайте
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center border border-coal-600 text-bone transition-all hover:rotate-90 hover:border-signal hover:text-signal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {/* вкладки */}
          <div className="flex gap-8 border-b border-coal-700">
            {tabBtn("file", "Файл с устройства")}
            {tabBtn("url", "Ссылка")}
          </div>

          {/* зона файла */}
          {tab === "file" && (
            <div className="mt-5">
              {!file && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    acceptFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex w-full flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-10 transition-all duration-200 ${
                    dragActive
                      ? "scale-[1.01] border-ember bg-coal-850"
                      : "border-coal-600 hover:border-ember/70 hover:bg-coal-850"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`h-9 w-9 ${dragActive ? "text-ember" : "text-bone-dim"}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M12 16V4m0 0L7 9m5-5 5 5" strokeLinecap="square" />
                    <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" strokeLinecap="square" />
                  </svg>
                  <span className="text-sm font-semibold text-bone">
                    {dragActive ? "Отпускайте — берём в работу" : "Перетащите видео сюда"}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                    или кликните, чтобы выбрать · MP4 / WebM / MOV
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.webm,.mov,.m4v"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />

              {file && (
                <div className="fade-in flex items-center gap-4 border border-coal-600 bg-coal-950 p-3">
                  <div className="h-16 w-28 shrink-0 overflow-hidden bg-coal-800">
                    {analyzing ? (
                      <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-bone-dim">
                        <span className="blink">чтение…</span>
                      </div>
                    ) : (
                      poster && <img src={poster} alt="Постер" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-bone">{file.name}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-bone-dim">
                      {formatFileSize(file.size)} · {duration} · постер из кадра
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPoster("");
                      setDuration("—:—");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="shrink-0 border border-coal-600 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-bone-dim transition-colors hover:border-signal hover:text-signal"
                  >
                    Заменить
                  </button>
                </div>
              )}
            </div>
          )}

          {/* поле ссылки */}
          {tab === "url" && (
            <div className="mt-5">
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Прямая ссылка на видео
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/videos/rolik.mp4"
                className={`${inputCls} font-mono text-xs`}
              />
              <p className="mt-2 text-xs leading-relaxed text-bone-dim">
                Подойдёт любая ссылка, откуда видео играет напрямую (mp4/webm). Постер нарисуем сами —
                в стиле архива.
              </p>
            </div>
          )}

          {/* общие поля */}
          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Название <span className="text-ember">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: «Летний промо-ролик»"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Категория
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputCls}>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Клиент / проект
              </label>
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Необязательно"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Описание
              </label>
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Пара слов о ролике"
                className={inputCls}
              />
            </div>
          </div>

          {error && (
            <p className="fade-in mt-4 flex items-center gap-2 border border-signal/50 bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 8v5m0 3v.5" strokeLinecap="square" />
                <rect x="3.5" y="3.5" width="17" height="17" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* футер */}
        <div className="flex items-center justify-end gap-3 border-t border-coal-700 px-6 py-4">
          <button
            onClick={onClose}
            className="border border-coal-600 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-bone-dim hover:text-bone"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy || analyzing}
            className="bg-ember px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 transition-all hover:bg-ember-soft hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {busy ? "Сохраняем…" : "Добавить в архив"}
          </button>
        </div>
      </div>
    </div>
  );
}
