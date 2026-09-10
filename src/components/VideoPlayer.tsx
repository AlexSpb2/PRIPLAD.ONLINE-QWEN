import { useRef, useState } from "react";

interface VideoPlayerProps {
  url: string; poster?: string; autoPlay?: boolean; controls?: boolean;
  muted?: boolean; loop?: boolean; className?: string;
}

function extractIframeSrc(value: string): string {
  const match = value.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/i);
  return match ? match[1].replace(/&amp;/g, "&") : value.trim();
}

export default function VideoPlayer({ url, poster, autoPlay = false, controls = true, muted = false, loop = false, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const sourceUrl = extractIframeSrc(url);

  const getVideoType = (value: string): "direct" | "youtube" | "vimeo" | "rutube" | "vk" | "iframe" => {
    if (!value) return "direct";
    if (/youtube\.com|youtu\.be/i.test(value)) return "youtube";
    if (/vimeo\.com/i.test(value)) return "vimeo";
    if (/rutube\.ru/i.test(value)) return "rutube";
    if (/vk\.com|vkvideo\.ru|video_ext\.php/i.test(value)) return "vk";
    if (/\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(value)) return "direct";
    return "iframe";
  };

  const getEmbedUrl = (value: string, type: string): string => {
    switch (type) {
      case "youtube": {
        const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?\/\n]+)/i);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}` : value;
      }
      case "vimeo": {
        const match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}` : value;
      }
      case "rutube": {
        const match = value.match(/rutube\.ru\/video\/([^/?]+)/i);
        return match ? `https://rutube.ru/play/embed/${match[1]}` : value;
      }
      case "vk":
        // Рабочий VK video_ext.php не преобразуем.
        return value;
      default:
        return value;
    }
  };

  const videoType = getVideoType(sourceUrl);
  const embedUrl = getEmbedUrl(sourceUrl, videoType);

  if (videoType === "direct") {
    return <video ref={videoRef} src={sourceUrl} poster={poster} autoPlay={autoPlay} controls={controls} muted={muted} loop={loop} playsInline className={className} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />;
  }

  return <iframe src={embedUrl} title="Видео" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className={className} frameBorder="0" />;
}
