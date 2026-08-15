export type Category = "Анимация" | "Реклама" | "Авто" | "Игровое";

export interface VideoWork {
  id: string;
  title: string;
  category: Category;
  year: number;
  client: string;
  role: string;
  duration: string;
  src: string;
  poster: string;
  desc: string;
  tags: string[];
}

const CDN = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";
const img = (name: string) => `${CDN}/images/${name}.jpg`;

export const CATEGORIES: ("Все" | Category)[] = ["Все", "Анимация", "Реклама", "Авто", "Игровое"];

export const VIDEOS: VideoWork[] = [
  {
    id: "bbb",
    title: "Большой Бак",
    category: "Анимация",
    year: 2008,
    client: "Blender Foundation",
    role: "Режиссура, анимация",
    duration: "09:56",
    src: `${CDN}/BigBuckBunny.mp4`,
    poster: img("BigBuckBunny"),
    desc: "Комедийный короткометражный фильм о гигантском кролике, который мирно живёт на лугу, — пока трое грызунов-хулиганов не решают, что им всё дозволено. Открытый пайплайн, полностью в Blender.",
    tags: ["3D", "Blender", "комедия", "опенсорс"],
  },
  {
    id: "ed",
    title: "Сон слона",
    category: "Анимация",
    year: 2006,
    client: "Blender Foundation",
    role: "Анимация, композитинг",
    duration: "10:53",
    src: `${CDN}/ElephantsDream.mp4`,
    poster: img("ElephantsDream"),
    desc: "Первый в мире открытый фильм. Два персонажа бродят по сюрреалистичной механической вселенной, которая подчиняется лишь собственным правилам. Эксперимент о доверии и воображении.",
    tags: ["сюрреализм", "3D", "первый открытый фильм"],
  },
  {
    id: "sintel",
    title: "Синтел",
    category: "Анимация",
    year: 2010,
    client: "Blender Foundation",
    role: "Монтаж, цветокор",
    duration: "14:48",
    src: `${CDN}/Sintel.mp4`,
    poster: img("Sintel"),
    desc: "Девушка Синтел пересекает континент в поисках дракончика Скейлза, которого вырастила и потеряла. Эпическая история о привязанности, взрослении и цене одержимости.",
    tags: ["фэнтези", "эпик", "драма"],
  },
  {
    id: "tos",
    title: "Стальные слёзы",
    category: "Игровое",
    year: 2012,
    client: "Mango Open Movie",
    role: "VFX-супервайз",
    duration: "12:14",
    src: `${CDN}/TearsOfSteel.mp4`,
    poster: img("TearsOfSteel"),
    desc: "Амстердам, сорок лет после расставания. Группа учёных и воинов воспроизводит ключевой момент прошлого, чтобы спасти мир от машин. Игровое кино с полным CG-пайплайном.",
    tags: ["sci-fi", "VFX", "live-action"],
  },
  {
    id: "blazes",
    title: "Огни большого экрана",
    category: "Реклама",
    year: 2013,
    client: "Google Chromecast",
    role: "Режиссёр монтажа",
    duration: "00:15",
    src: `${CDN}/ForBiggerBlazes.mp4`,
    poster: img("ForBiggerBlazes"),
    desc: "Пятнадцатисекундный ролик для стриминговой платформы: камин, экран во всю стену и ощущение, что вечер только начинается. Максимум атмосферы в минимальном хронометраже.",
    tags: ["15 сек", "стриминг", "атмосфера"],
  },
  {
    id: "escapes",
    title: "Побег на выходные",
    category: "Реклама",
    year: 2013,
    client: "Google Chromecast",
    role: "Монтаж, звук",
    duration: "00:15",
    src: `${CDN}/ForBiggerEscapes.mp4`,
    poster: img("ForBiggerEscapes"),
    desc: "Реклама-эскапизм: одно касание — и гостиная превращается в портал. Быстрый монтаж, плотный саунд-дизайн и один точный оффер в финале.",
    tags: ["15 сек", "динамичный монтаж"],
  },
  {
    id: "fun",
    title: "Больше веселья",
    category: "Реклама",
    year: 2014,
    client: "Google Chromecast",
    role: "Режиссёр, монтаж",
    duration: "01:00",
    src: `${CDN}/ForBiggerFun.mp4`,
    poster: img("ForBiggerFun"),
    desc: "Минутный ролик о том, как большой экран меняет вечеринку. Работали с живыми людьми и настоящим смехом — без единого студийного кадра.",
    tags: ["60 сек", "lifestyle", "репортажная манера"],
  },
  {
    id: "joyrides",
    title: "Прогулка с ветерком",
    category: "Реклама",
    year: 2014,
    client: "Google Chromecast",
    role: "Монтаж",
    duration: "00:15",
    src: `${CDN}/ForBiggerJoyrides.mp4`,
    poster: img("ForBiggerJoyrides"),
    desc: "Короткий драйв-ролик: дорога, солнце и плейлист, который звучит как главный герой. Склейки в ритм трека, ни одной статичной сцены.",
    tags: ["15 сек", "драйв", "ритм-монтаж"],
  },
  {
    id: "meltdowns",
    title: "Тает на глазах",
    category: "Реклама",
    year: 2014,
    client: "Google Chromecast",
    role: "Цветокор, монтаж",
    duration: "00:15",
    src: `${CDN}/ForBiggerMeltdowns.mp4`,
    poster: img("ForBiggerMeltdowns"),
    desc: "Холодный расчёт и горячая картинка: ролик о том, что некоторые вещи невозможно пропустить. Тёплый грейдинг поверх зимней фактуры.",
    tags: ["15 сек", "цветокор", "контраст"],
  },
  {
    id: "subaru",
    title: "Грязь и асфальт",
    category: "Авто",
    year: 2015,
    client: "Subaru",
    role: "Режиссёр, аэросъёмка",
    duration: "09:37",
    src: `${CDN}/SubaruOutbackOnStreetAndDirt.mp4`,
    poster: img("SubaruOutbackOnStreetAndDirt"),
    desc: "Большой тест-драйв Outback: город, серпантин и грунтовка в одном маршруте. Дрон, погоня на стедикаме и честный звук мотора без подложек.",
    tags: ["тест-драйв", "аэро", "стедикам"],
  },
  {
    id: "gti",
    title: "Обзор GTI",
    category: "Авто",
    year: 2015,
    client: "Volkswagen",
    role: "Режиссёр монтажа",
    duration: "10:03",
    src: `${CDN}/VolkswagenGTIReview.mp4`,
    poster: img("VolkswagenGTIReview"),
    desc: "Подробный видеообзор хот-хэтча: разгон, салон, нюансы поведения на треке. Формат «говорящая голова + перебивки», доведённый до темпа клипа.",
    tags: ["обзор", "трек", "перебивки"],
  },
  {
    id: "bullrun",
    title: "Буллран: дорога зовёт",
    category: "Авто",
    year: 2016,
    client: "Bullrun Rally",
    role: "Репортаж, монтаж",
    duration: "00:47",
    src: `${CDN}/WeAreGoingOnBullrun.mp4`,
    poster: img("WeAreGoingOnBullrun"),
    desc: "Тизер легендарного ралли: колонна суперкаров, пыль, бензин и предвкушение. Снято за один день на трассе и смонтировано за одну ночь.",
    tags: ["ралли", "тизер", "репортаж"],
  },
];

export const FEATURED_ID = "bbb";
