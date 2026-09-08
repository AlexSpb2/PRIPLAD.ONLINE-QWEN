export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
  sortOrder: number;
  published: boolean;
}

// Mock-данные для видео
// В будущем эти данные будут приходить из backend
export const VIDEOS: Video[] = [
  {
    id: "showreel-26",
    title: "ШОУРИЛ'26",
    description: "Подборка лучших работ за 2026 год",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    sortOrder: 1,
    published: true,
  },
  {
    id: "featured-1",
    title: "Городские огни",
    description: "AI-генерация ночного города с неоновыми вывесками",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    sortOrder: 2,
    published: true,
  },
  {
    id: "featured-2",
    title: "Цифровой рассвет",
    description: "Генерация пейзажа на стыке реального и виртуального",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    sortOrder: 3,
    published: true,
  },
  {
    id: "featured-3",
    title: "Механика движения",
    description: "Эксперимент с физикой и динамикой в AI-видео",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    sortOrder: 4,
    published: true,
  },
  {
    id: "featured-4",
    title: "Портрет эпохи",
    description: "AI-интерпретация классического портрета",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    sortOrder: 5,
    published: true,
  },
  {
    id: "featured-5",
    title: "Скорость света",
    description: "Динамичный ролик о движении и скорости",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    sortOrder: 6,
    published: true,
  },
  {
    id: "featured-6",
    title: "Текстуры времени",
    description: "Работа с текстурой и деталями в AI-генерации",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    sortOrder: 7,
    published: true,
  },
  {
    id: "featured-7",
    title: "Архитектура снов",
    description: "Сюрреалистичные пространства, созданные AI",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    sortOrder: 8,
    published: true,
  },
  {
    id: "featured-8",
    title: "Стальные слёзы",
    description: "Смешение live-action и AI-генерации",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    sortOrder: 9,
    published: true,
  },
  {
    id: "featured-9",
    title: "Грани реальности",
    description: "Исследование границы между реальным и сгенерированным",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    sortOrder: 10,
    published: true,
  },
];

// ШОУРИЛ - один выбранный ролик
export const SHOWREEL = VIDEOS.find((v) => v.id === "showreel-26") || VIDEOS[0];

// ИЗБРАННЫЕ РАБОТЫ - отсортированы по sortOrder
export const FEATURED_WORKS = VIDEOS.filter((v) => v.published && v.id !== "showreel-26")
  .sort((a, b) => a.sortOrder - b.sortOrder);
