// Типы данных для админки и публичной части

export interface Format {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: string;
  duration: string;
  sortOrder: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
  duration: string;
  formatId: string;
  sortOrder: number;
  published: boolean;
}

export interface Showreel {
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
}

export interface AppData {
  formats: Format[];
  videos: Video[];
  showreel: Showreel;
}
