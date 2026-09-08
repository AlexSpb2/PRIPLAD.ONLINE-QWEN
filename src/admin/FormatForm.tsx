import { useState, useEffect } from "react";
import { useApp } from "../store/AppContext";
import type { Format } from "../types";

interface FormatFormProps {
  format: Format | null;
  onClose: () => void;
}

export default function FormatForm({ format, onClose }: FormatFormProps) {
  const { data, addFormat, updateFormat } = useApp();
  const isEditing = !!format;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (format) {
      setName(format.name);
      setIcon(format.icon);
      setDescription(format.description);
      setPrice(format.price);
      setDuration(format.duration);
    }
  }, [format]);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) return;

    setSaving(true);
    try {
      if (isEditing && format) {
        await updateFormat(format.id, {
          name,
          icon,
          description,
          price,
          duration,
        });
      } else {
        const maxSort = Math.max(0, ...data.formats.map((f) => f.sortOrder));
        await addFormat({
          name,
          icon,
          description,
          price,
          duration,
          sortOrder: maxSort + 1,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-coal-950/95 p-4">
      <div className="w-full max-w-lg overflow-y-auto border border-coal-700 bg-coal-900">
        <div className="flex items-center justify-between border-b border-coal-700 px-5 py-3">
          <h3 className="font-display text-base font-bold">
            {isEditing ? "Редактировать формат" : "Новый формат"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-coal-600 text-bone hover:border-signal hover:text-signal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="flex gap-4">
            <div className="w-24">
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Иконка *
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                maxLength={4}
                placeholder="🎭"
                className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-center text-2xl text-bone focus:border-ember focus:outline-none"
              />
              <p className="mt-1 font-mono text-[9px] text-coal-600">Emoji или символ</p>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Название *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Цена
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="от 15 000 ₽"
                className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                Длительность
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30–60 сек"
                className="w-full border border-coal-600 bg-coal-950 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-coal-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-bone-dim hover:border-bone-dim hover:text-bone"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-ember px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-coal-950 hover:bg-ember-soft disabled:opacity-60"
            >
              {saving ? "Сохранение..." : isEditing ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
