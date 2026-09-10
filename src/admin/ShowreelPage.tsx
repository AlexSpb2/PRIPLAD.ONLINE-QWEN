import { useState, useEffect } from "react";
import { useApp } from "../store/AppContext";

export default function ShowreelPage() {
  const { data, updateShowreel } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [poster, setPoster] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.showreel.title); setDescription(data.showreel.description);
      setVideoUrl(data.showreel.videoUrl); setPoster(data.showreel.poster);
    }
  }, [data]);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;
    setSaving(true);
    try {
      await updateShowreel({ title: title.trim(), description, videoUrl: videoUrl.trim(), poster });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  return <div>
    <h2 className="mb-6 font-display text-xl font-black">ШОУРИЛ</h2>
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div><label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">Заголовок *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="ШОУРИЛ'26" className="w-full border border-coal-600 bg-coal-900 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none" /></div>
      <div><label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">Описание</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Подборка работ за 2026 год" className="w-full border border-coal-600 bg-coal-900 px-3 py-2 text-sm text-bone focus:border-ember focus:outline-none" /></div>
      <div><label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">URL / iframe видео *</label><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required rows={3} placeholder="https://... или полный <iframe ...> код" className="w-full border border-coal-600 bg-coal-900 px-3 py-2 font-mono text-xs text-bone focus:border-ember focus:outline-none" /><p className="mt-1 font-mono text-[9px] text-coal-600">YouTube, Shorts, Vimeo, RuTube, VK Video/video_ext.php, iframe/embed, прямой mp4</p></div>
      <div><label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">URL постера</label><input type="text" value={poster} onChange={(e) => setPoster(e.target.value)} placeholder="https://..." className="w-full border border-coal-600 bg-coal-900 px-3 py-2 font-mono text-xs text-bone focus:border-ember focus:outline-none" /></div>
      {poster && <div className="h-32 w-full overflow-hidden border border-line bg-coal-800"><img src={poster} alt="Превью" className="h-full w-full object-cover" /></div>}
      <div className="flex items-center gap-3 pt-2"><button type="submit" disabled={saving} className="bg-ember px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-coal-950 hover:bg-ember-soft disabled:opacity-60">{saving ? "Сохранение..." : "Сохранить"}</button>{saved && <span className="font-mono text-xs text-ember">✓ Сохранено</span>}</div>
    </form>
  </div>;
}
