import { useState } from "react";
import { useApp } from "../store/AppContext";
import type { Format } from "../types";
import FormatForm from "./FormatForm";
import FormatIcon from "../components/FormatIcon";

export default function FormatsPage() {
  const { data, deleteFormat } = useApp();
  const [editing, setEditing] = useState<Format | null>(null);
  const [adding, setAdding] = useState(false);

  if (!data) return null;

  const formats = [...data.formats].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDelete = async (format: Format) => {
    const videoCount = data.videos.filter((v) => v.formatId === format.id).length;
    const message = videoCount > 0
      ? `Удалить формат «${format.name}» и все ${videoCount} видео в нём?`
      : `Удалить формат «${format.name}»?`;
    if (confirm(message)) {
      await deleteFormat(format.id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-black">ФОРМАТЫ</h2>
        <button
          onClick={() => setAdding(true)}
          className="bg-ember px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 hover:bg-ember-soft"
        >
          + Добавить
        </button>
      </div>

      <div className="space-y-3">
        {formats.map((format) => {
          const videoCount = data.videos.filter((v) => v.formatId === format.id).length;
          return (
            <div key={format.id} className="flex items-center gap-4 border border-line bg-coal-900 p-4">
              <FormatIcon icon={format.icon} formatName={format.name} className="h-6 w-6 text-ember" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{format.name}</p>
                <p className="mt-0.5 truncate text-xs text-bone-dim">{format.description}</p>
                <div className="mt-1 flex flex-wrap gap-2 font-mono text-[10px] text-bone-dim">
                  <span>{format.price}</span><span>·</span><span>{format.duration}</span><span>·</span><span>{videoCount} видео</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button onClick={() => setEditing(format)} className="border border-coal-600 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-bone-dim hover:border-bone-dim hover:text-bone">Изм.</button>
                <button onClick={() => handleDelete(format)} className="border border-coal-600 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-bone-dim hover:border-signal hover:text-signal">✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {formats.length === 0 && <p className="mt-8 text-center font-mono text-sm text-coal-600">Нет форматов. Создайте первый.</p>}

      {(adding || editing) && (
        <FormatForm format={editing} onClose={() => { setAdding(false); setEditing(null); }} />
      )}
    </div>
  );
}
