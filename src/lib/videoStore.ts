import type { Category } from "../data/videos";

export interface StoredVideo {
  id: string;
  kind: "file" | "url";
  title: string;
  category: Category;
  client: string;
  role: string;
  desc: string;
  /** для kind="url" — внешняя ссылка; для file — пустая (src создаётся из blob) */
  src: string;
  poster: string;
  duration: string;
  addedAt: number;
  blob?: Blob;
}

const DB_NAME = "kadr-video-archive";
const STORE = "videos";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB недоступен"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Не удалось открыть хранилище"));
  });
}

export async function saveUserVideo(record: StoredVideo): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Ошибка записи"));
    };
  });
}

export async function loadUserVideos(): Promise<StoredVideo[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      db.close();
      resolve((req.result as StoredVideo[]) ?? []);
    };
    req.onerror = () => {
      db.close();
      reject(req.error ?? new Error("Ошибка чтения"));
    };
  });
}

export async function deleteUserVideo(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Ошибка удаления"));
    };
  });
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "—:—";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

/** Фирменный постер, нарисованный на canvas — для роликов по ссылке. */
export function makeFallbackPoster(title: string, category: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#171410";
  ctx.fillRect(0, 0, 640, 360);

  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = "#f5a623";
  for (let i = -4; i < 12; i++) {
    ctx.save();
    ctx.translate(i * 64, 360);
    ctx.rotate(-Math.PI / 5);
    ctx.fillRect(0, 0, 26, 620);
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle = "#f5a623";
  ctx.beginPath();
  ctx.moveTo(468, 118);
  ctx.lineTo(468, 242);
  ctx.lineTo(576, 180);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#3b3327";
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 632, 332);

  ctx.fillStyle = "#a89c85";
  ctx.font = "600 15px 'JetBrains Mono', monospace";
  ctx.fillText(category.toUpperCase(), 40, 66);

  ctx.fillStyle = "#f3ecdd";
  ctx.font = "800 42px 'Golos Text', 'Arial Black', sans-serif";
  const t = title.length > 17 ? `${title.slice(0, 16)}…` : title;
  ctx.fillText(t || "Без названия", 40, 292);

  ctx.fillStyle = "#a89c85";
  ctx.font = "500 13px 'JetBrains Mono', monospace";
  ctx.fillText("КАДР · личный архив", 40, 320);

  return canvas.toDataURL("image/jpeg", 0.85);
}

/** Достаёт длительность и постер-кадр из видео (для локальных файлов). */
export function analyzeVideo(src: string, title: string, category: string): Promise<{ poster: string; duration: string }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    let duration = "—:—";

    const finish = (poster: string) => {
      clearTimeout(timer);
      resolve({ poster, duration });
    };
    const timer = setTimeout(() => finish(makeFallbackPoster(title, category)), 8000);

    video.onerror = () => finish(makeFallbackPoster(title, category));
    video.onloadedmetadata = () => {
      duration = formatDuration(video.duration);
      try {
        video.currentTime = Math.min(1, (video.duration || 2) / 3);
      } catch {
        finish(makeFallbackPoster(title, category));
      }
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.drawImage(video, 0, 0, 640, 360);
        const url = canvas.toDataURL("image/jpeg", 0.8);
        finish(url);
      } catch {
        finish(makeFallbackPoster(title, category));
      }
    };
    video.src = src;
  });
}
