import { useState } from "react";
import { useApp } from "../store/AppContext";
import type { Video } from "../types";
import VideoForm from "./VideoForm";
import FormatIcon from "../components/FormatIcon";

export default function VideosPage() {
  const { data, deleteVideo, updateVideo, reorderVideos } = useApp();
  const [editing, setEditing] = useState<Video | null>(null);
  const [adding, setAdding] = useState(false);
  const [filterFormat, setFilterFormat] = useState<string>("all");
  const [dragState, setDragState] = useState<{ formatId: string; fromIndex: number } | null>(null);
  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);
  const filteredVideos = filterFormat === "all" ? data.videos : data.videos.filter((v) => v.formatId === filterFormat);
  const videosByFormat = formats.map((f) => ({ format: f, videos: data.videos.filter((v) => v.formatId === f.id).sort((a, b) => a.sortOrder - b.sortOrder) }));

  const handleTogglePublish = async (video: Video) => { await updateVideo(video.id, { published: !video.published }); };
  const handleDelete = async (video: Video) => { if (confirm(`Удалить видео «${video.title}»?`)) await deleteVideo(video.id); };
  const handleDragStart = (formatId: string, index: number) => setDragState({ formatId, fromIndex: index });
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (formatId: string, toIndex: number) => {
    if (!dragState || dragState.formatId !== formatId) return;
    const formatVideos = data.videos.filter((v) => v.formatId === formatId).sort((a, b) => a.sortOrder - b.sortOrder);
    const newOrder = [...formatVideos];
    const [moved] = newOrder.splice(dragState.fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    await reorderVideos(formatId, newOrder.map((v) => v.id));
    setDragState(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h2 className="font-display text-xl font-black">ВИДЕО</h2><button onClick={() => setAdding(true)} className="bg-ember px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 hover:bg-ember-soft">+ Добавить</button></div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilterFormat("all")} className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${filterFormat === "all" ? "border-ember bg-ember text-coal-950" : "border-line text-bone-dim hover:text-bone"}`}>Все ({data.videos.length})</button>
        {formats.map((f) => { const count = data.videos.filter((v) => v.formatId === f.id).length; return <button key={f.id} onClick={() => setFilterFormat(f.id)} className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${filterFormat === f.id ? "border-ember bg-ember text-coal-950" : "border-line text-bone-dim hover:text-bone"}`}><FormatIcon icon={f.icon} formatName={f.name} className="h-3 w-3" />{f.name} ({count})</button>; })}
      </div>

      {filterFormat === "all" ? <div className="space-y-8">{videosByFormat.map(({ format, videos }) => <div key={format.id}><h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold"><FormatIcon icon={format.icon} formatName={format.name} className="h-4 w-4 text-ember" /><span>{format.name}</span><span className="font-mono text-[10px] text-bone-dim">({videos.length})</span></h3>{videos.length === 0 ? <p className="font-mono text-xs text-coal-600">Нет видео</p> : <div className="space-y-2">{videos.map((video, index) => <VideoRow key={video.id} video={video} format={format} index={index} onEdit={setEditing} onTogglePublish={handleTogglePublish} onDelete={handleDelete} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} isDragging={dragState?.formatId === format.id && dragState.fromIndex === index} />)}</div>}</div>)}</div> : <div className="space-y-2">{filteredVideos.sort((a, b) => a.sortOrder - b.sortOrder).map((video, index) => { const format = formats.find((f) => f.id === video.formatId); return format ? <VideoRow key={video.id} video={video} format={format} index={index} onEdit={setEditing} onTogglePublish={handleTogglePublish} onDelete={handleDelete} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} isDragging={false} /> : null; })}</div>}

      {(adding || editing) && <VideoForm video={editing} onClose={() => { setAdding(false); setEditing(null); }} />}
    </div>
  );
}

interface VideoRowProps {
  video: Video;
  format: { name: string; icon: string };
  index: number;
  onEdit: (video: Video) => void;
  onTogglePublish: (video: Video) => void;
  onDelete: (video: Video) => void;
  onDragStart: (formatId: string, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (formatId: string, index: number) => void;
  isDragging: boolean;
}

function VideoRow({ video, format, index, onEdit, onTogglePublish, onDelete, onDragStart, onDragOver, onDrop, isDragging }: VideoRowProps) {
  return <div draggable onDragStart={() => onDragStart(video.formatId, index)} onDragOver={onDragOver} onDrop={() => onDrop(video.formatId, index)} className={`flex items-center gap-3 border border-line bg-coal-900 p-3 transition-all ${isDragging ? "opacity-50" : ""} hover:border-ember/40 cursor-grab active:cursor-grabbing`}>
    <span className="w-6 shrink-0 font-mono text-[10px] text-bone-dim">{String(index + 1).padStart(2, "0")}</span>
    <div className="h-10 w-16 shrink-0 overflow-hidden bg-coal-800">{video.poster ? <img src={video.poster} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><FormatIcon icon={format.icon} formatName={format.name} className="h-5 w-5 text-bone-dim" /></div>}</div>
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{video.title}</p><p className="flex items-center gap-1.5 truncate font-mono text-[10px] text-bone-dim"><FormatIcon icon={format.icon} formatName={format.name} className="h-3 w-3 shrink-0" /><span className="truncate">{format.name} · {video.published ? "Опубликовано" : "Скрыто"}{video.duration ? ` · ${video.duration}` : ""}</span></p></div>
    <div className="flex shrink-0 items-center gap-1.5"><button onClick={() => onTogglePublish(video)} className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${video.published ? "border-ember/50 text-ember hover:bg-ember hover:text-coal-950" : "border-coal-600 text-bone-dim hover:border-ember hover:text-ember"}`}>{video.published ? "Скрыть" : "Показать"}</button><button onClick={() => onEdit(video)} className="border border-coal-600 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-bone-dim hover:border-bone-dim hover:text-bone">Изм.</button><button onClick={() => onDelete(video)} className="border border-coal-600 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-bone-dim hover:border-signal hover:text-signal">✕</button></div>
  </div>;
}
