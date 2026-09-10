import type { AppData, Format, Video, Showreel } from "../types";

// Mock API с localStorage
// В будущем этот файл будет заменён на fetch к PHP API

const STORAGE_KEY = "priplad_admin_data";
const AUTH_KEY = "priplad_auth_token";

// Пароль для mock-авторизации (в будущем будет на сервере)
const MOCK_PASSWORD = "priplad2026";

// Начальные mock-данные
const INITIAL_DATA: AppData = {
  formats: [
    {
      id: "format-1",
      name: "Нейророзыгрыш",
      icon: "🎭",
      description: "AI-генерация розыгрышей с неожиданными поворотами",
      price: "от 15 000 ₽",
      duration: "30–60 сек",
      sortOrder: 1,
    },
    {
      id: "format-2",
      name: "Одним словом",
      icon: "💬",
      description: "Короткие видео с мощным визуальным акцентом",
      price: "от 10 000 ₽",
      duration: "15–30 сек",
      sortOrder: 2,
    },
    {
      id: "format-3",
      name: "Видео про героев праздника",
      icon: "🎉",
      description: "Персонализированные поздравления с AI-визуализацией",
      price: "от 12 000 ₽",
      duration: "45–90 сек",
      sortOrder: 3,
    },
  ],
  videos: [
    {
      id: "video-1",
      title: "Случайный прохожий",
      description: "AI-генерация неожиданной ситуации в городе",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      formatId: "format-1",
      sortOrder: 1,
      published: true,
    },
    {
      id: "video-2",
      title: "Кофе в парке",
      description: "Неожиданный поворот с чашкой кофе",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
      formatId: "format-1",
      sortOrder: 2,
      published: true,
    },
    {
      id: "video-3",
      title: "Свобода",
      description: "Визуальная метафора свободы",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
      formatId: "format-2",
      sortOrder: 1,
      published: true,
    },
    {
      id: "video-4",
      title: "Время",
      description: "Мимолётность момента",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
      formatId: "format-2",
      sortOrder: 2,
      published: true,
    },
    {
      id: "video-5",
      title: "День рождения",
      description: "Персонализированное поздравление",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
      formatId: "format-3",
      sortOrder: 1,
      published: true,
    },
    {
      id: "video-6",
      title: "Юбилей",
      description: "Торжественное поздравление",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
      formatId: "format-3",
      sortOrder: 2,
      published: true,
    },
  ],
  showreel: {
    title: "ШОУРИЛ'26",
    description: "Подборка работ за 2026 год",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
};

// Утилиты для работы с localStorage
function loadData(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DATA;
    }
  }
  return INITIAL_DATA;
}

function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// API методы
export const api = {
  // Авторизация
  async login(password: string): Promise<{ success: boolean; token?: string }> {
    await new Promise((r) => setTimeout(r, 300)); // Имитация задержки
    if (password === MOCK_PASSWORD) {
      const token = "mock-token-" + Date.now();
      localStorage.setItem(AUTH_KEY, token);
      return { success: true, token };
    }
    return { success: false };
  },

  async ping(): Promise<boolean> {
    const token = localStorage.getItem(AUTH_KEY);
    return !!token;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_KEY);
  },

  // Получение всех данных
  async data(): Promise<AppData> {
    return loadData();
  },

  // Видео
  async addVideo(video: Omit<Video, "id">): Promise<Video> {
    const data = loadData();
    const newVideo: Video = {
      ...video,
      id: "video-" + Date.now(),
    };
    data.videos.push(newVideo);
    saveData(data);
    return newVideo;
  },

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
    const data = loadData();
    const index = data.videos.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Video not found");
    data.videos[index] = { ...data.videos[index], ...updates };
    saveData(data);
    return data.videos[index];
  },

  async deleteVideo(id: string): Promise<void> {
    const data = loadData();
    data.videos = data.videos.filter((v) => v.id !== id);
    saveData(data);
  },

  async reorderVideos(formatId: string, videoIds: string[]): Promise<void> {
    const data = loadData();
    const formatVideos = data.videos.filter((v) => v.formatId === formatId);
    videoIds.forEach((id, index) => {
      const video = formatVideos.find((v) => v.id === id);
      if (video) {
        video.sortOrder = index + 1;
      }
    });
    saveData(data);
  },

  // Форматы
  async addFormat(format: Omit<Format, "id">): Promise<Format> {
    const data = loadData();
    const newFormat: Format = {
      ...format,
      id: "format-" + Date.now(),
    };
    data.formats.push(newFormat);
    saveData(data);
    return newFormat;
  },

  async updateFormat(id: string, updates: Partial<Format>): Promise<Format> {
    const data = loadData();
    const index = data.formats.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Format not found");
    data.formats[index] = { ...data.formats[index], ...updates };
    saveData(data);
    return data.formats[index];
  },

  async deleteFormat(id: string): Promise<void> {
    const data = loadData();
    // Каскадное удаление видео
    data.videos = data.videos.filter((v) => v.formatId !== id);
    data.formats = data.formats.filter((f) => f.id !== id);
    saveData(data);
  },

  // Showreel
  async updateShowreel(showreel: Showreel): Promise<Showreel> {
    const data = loadData();
    data.showreel = showreel;
    saveData(data);
    return showreel;
  },
};
