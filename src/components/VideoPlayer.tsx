import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * Универсальный видеоплеер.
 * Определяет тип URL и рендерит:
 * - <video> для прямых файлов
 * - <iframe> для YouTube, Vimeo, RuTube, VK Video
 */
export default function VideoPlayer({
  url,
  poster,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Определяем тип URL
  const getVideoType = (url: string): "direct" | "youtube" | "vimeo" | "rutube" | "vk" | "iframe" => {
    if (!url) return "direct";
    
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }
    
    // Vimeo
    if (url.includes("vimeo.com")) {
      return "vimeo";
    }
    
    // RuTube
    if (url.includes("rutube.ru")) {
      return "rutube";
    }
    
    // VK Video (включая video_ext.php)
    if (url.includes("vk.com") || url.includes("vkvideo.ru") || url.includes("video_ext.php")) {
      return "vk";
    }
    
    // Прямой файл
    if (/\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(url)) {
      return "direct";
    }
    
    // По умолчанию — iframe
    return "iframe";
  };

  const getEmbedUrl = (url: string, type: string): string => {
    switch (type) {
      case "youtube": {
        // Извлекаем ID видео
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\n]+)/);
        if (match) {
          return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}`;
        }
        return url;
      }
      
      case "vimeo": {
        const match = url.match(/vimeo\.com\/(\d+)/);
        if (match) {
          return `https://player.vimeo.com/video/${match[1]}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}`;
        }
        return url;
      }
      
      case "rutube": {
        const match = url.match(/rutube\.ru\/video\/([^\/\?]+)/);
        if (match) {
          return `https://rutube.ru/play/embed/${match[1]}`;
        }
        return url;
      }
      
      case "vk": {
        // VK Video может использовать video_ext.php — не преобразовываем
        if (url.includes("video_ext.php")) {
          return url;
        }
        return url;
      }
      
      default:
        return url;
    }
  };

  const videoType = getVideoType(url);
  const embedUrl = getEmbedUrl(url, videoType);

  // Для прямого видео
  if (videoType === "direct") {
    return (
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        playsInline
        className={className}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    );
  }

  // Для iframe-провайдеров
  return (
    <iframe
      src={embedUrl}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className={className}
      frameBorder="0"
    />
  );
}
