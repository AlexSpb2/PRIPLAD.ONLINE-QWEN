import type { AppData, Format, Video, Showreel } from "../types";

// Базовый URL API
const API_BASE = "/api";

/**
 * Универсальная функция для fetch запросов
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}/index.php?action=${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Для отправки cookies (сессии)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * API методы
 */
export const api = {
  // Проверка доступности API
  async ping(): Promise<{ status: string; timestamp: number; version: string }> {
    return apiRequest("ping");
  },

  // Авторизация
  async login(password: string): Promise<{ success: boolean; message?: string }> {
    return apiRequest("login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  // Проверка авторизации
  async checkAuth(): Promise<{ authenticated: boolean }> {
    return apiRequest("check_auth");
  },

  // Выход
  async logout(): Promise<{ success: boolean; message?: string }> {
    return apiRequest("logout", { method: "POST" });
  },

  // Получение всех данных
  async data(): Promise<AppData> {
    return apiRequest("data");
  },

  // Видео
  async addVideo(video: Omit<Video, "id">): Promise<{ success: boolean; id: string }> {
    return apiRequest("add_video", {
      method: "POST",
      body: JSON.stringify(video),
    });
  },

  async updateVideo(id: string, updates: Partial<Video>): Promise<{ success: boolean; message: string }> {
    return apiRequest("update_video", {
      method: "POST",
      body: JSON.stringify({ id, ...updates }),
    });
  },

  async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest("delete_video", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  async reorderVideos(formatId: string, videoIds: string[]): Promise<{ success: boolean; message: string }> {
    return apiRequest("reorder_videos", {
      method: "POST",
      body: JSON.stringify({ formatId, videoIds }),
    });
  },

  // Форматы
  async addFormat(format: Omit<Format, "id">): Promise<{ success: boolean; id: string }> {
    return apiRequest("add_format", {
      method: "POST",
      body: JSON.stringify(format),
    });
  },

  async updateFormat(id: string, updates: Partial<Format>): Promise<{ success: boolean; message: string }> {
    return apiRequest("update_format", {
      method: "POST",
      body: JSON.stringify({ id, ...updates }),
    });
  },

  async deleteFormat(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest("delete_format", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },

  // Шоурил
  async updateShowreel(showreel: Showreel): Promise<{ success: boolean; message: string }> {
    return apiRequest("update_showreel", {
      method: "POST",
      body: JSON.stringify(showreel),
    });
  },

  // Превью видео
  async videoPreview(url: string): Promise<{ thumbnail: string; url: string }> {
    return apiRequest("video_preview", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },
};
