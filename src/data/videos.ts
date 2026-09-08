export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
  sortOrder: number;
  published: boolean;
}

// Mock данные. Позже будут заменены через backend.
const CDN = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";
const img = (name: string) => `${CDN}/images/${name}.jpg`;

export const SHOWREEL: Video = {
  id: "showreel-2026",
  title: "ШОУРИЛ'26",
  description: "Подборка работ за 2026 год",
  videoUrl: `${CDN}/BigBuckBunny.mp4`,
  poster: img("BigBuckBunny"),
  sortOrder: 0,
  published: true,
};

export const FEATURED_WORKS: Video[] = [
  {
    id: "work-1",
    title: "Неоновый город",
    description: "AI-генерация киберпанк-локации с динамичной камерой",
    videoUrl: `${CDN}/ElephantsDream.mp4`,
    poster: img("ElephantsDream"),
    sortOrder: 1,
    published: true,
  },
  {
    id: "work-2",
    title: "Портрет в движении",
    description: "Эксперимент с AI-анимацией лица и микро-движениями",
    videoUrl: `${CDN}/Sintel.mp4`,
    poster: img("Sintel"),
    sortOrder: 2,
    published: true,
  },
  {
    id: "work-3",
    title: "Абстрактная форма",
    description: "Генеративная абстракция с морфингом и цветом",
    videoUrl: `${CDN}/TearsOfSteel.mp4`,
    poster: img("TearsOfSteel"),
    sortOrder: 3,
    published: true,
  },
  {
    id: "work-4",
    title: "Природа будущего",
    description: "Футуристический пейзаж, созданный с помощью AI",
    videoUrl: `${CDN}/ForBiggerBlazes.mp4`,
    poster: img("ForBiggerBlazes"),
    sortOrder: 4,
    published: true,
  },
  {
    id: "work-5",
    title: "Промо-ролик",
    description: "Коммерческий ролик с AI-визуализацией продукта",
    videoUrl: `${CDN}/ForBiggerEscapes.mp4`,
    poster: img("ForBiggerEscapes"),
    sortOrder: 5,
    published: true,
  },
  {
    id: "work-6",
    title: "Музыкальный клип",
    description: "AI-клип с генерацией образов под музыку",
    videoUrl: `${CDN}/ForBiggerFun.mp4`,
    poster: img("ForBiggerFun"),
    sortOrder: 6,
    published: true,
  },
  {
    id: "work-7",
    title: "Архитектурная визуализация",
    description: "Концепт здания будущего с AI-рендерингом",
    videoUrl: `${CDN}/ForBiggerJoyrides.mp4`,
    poster: img("ForBiggerJoyrides"),
    sortOrder: 7,
    published: true,
  },
  {
    id: "work-8",
    title: "Эксперимент: стиль",
    description: "Стилизация под разные художественные направления",
    videoUrl: `${CDN}/ForBiggerMeltdowns.mp4`,
    poster: img("ForBiggerMeltdowns"),
    sortOrder: 8,
    published: true,
  },
  {
    id: "work-9",
    title: "Документальный фрагмент",
    description: "AI-реконструкция исторического события",
    videoUrl: `${CDN}/SubaruOutbackOnStreetAndDirt.mp4`,
    poster: img("SubaruOutbackOnStreetAndDirt"),
    sortOrder: 9,
    published: true,
  },
];
