import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, FEATURED_ID, VIDEOS } from "./data/videos";
import type { Category, VideoWork } from "./data/videos";
import { useScrollProgress } from "./lib/hooks";
import {
  deleteUserVideo,
  loadUserVideos,
  saveUserVideo,
  uid,
  type StoredVideo,
} from "./lib/videoStore";
import AddVideoModal, { type NewVideoData } from "./components/AddVideoModal";
import Lightbox from "./components/Lightbox";
import Marquee from "./components/Marquee";
import Reveal from "./components/Reveal";
import Scramble from "./components/Scramble";
import Stage from "./components/Stage";
import Stats from "./components/Stats";
import Timecode from "./components/Timecode";
import Toast from "./components/Toast";
import VideoCard from "./components/VideoCard";

type Filter = "Все" | Category;
type UserVideo = VideoWork & { kind: "file" | "url" };

const NAV = [
  { href: "#showreel", label: "Шоурил" },
  { href: "#works", label: "Архив" },
  { href: "#process", label: "Процесс" },
  { href: "#contact", label: "Контакт" },
];

const STEPS = [
  {
    num: "01",
    title: "Идея и референсы",
    text: "Погружаюсь в задачу: аудитория, сообщение, тон. Собираю мудборд, пишу сценарий и покадровый план — ещё до съёмки понятен каждый кадр.",
    tags: ["бриф", "мудборд", "сценарий", "shot-list"],
  },
  {
    num: "02",
    title: "Съёмка",
    text: "Небольшая мобильная группа: камера, свет, звук. Пишем в 4K RAW, параллельно веду аэросъёмку и бэкстейдж для соцсетей.",
    tags: ["4K RAW", "аэро", "стедикам", "свет"],
  },
  {
    num: "03",
    title: "Монтаж и цвет",
    text: "Ритм важнее эффектов: черновой монтаж — за 48 часов, затем чистовой, саунд-дизайн и авторский грейдинг под характер бренда.",
    tags: ["монтаж", "саунд-дизайн", "грейдинг"],
  },
  {
    num: "04",
    title: "Релиз",
    text: "Готовлю версии под площадки — от вертикальных Reels до кинопрокатного DCP. Слежу за аналитикой и докручиваю подачу.",
    tags: ["Reels", "YouTube", "DCP", "аналитика"],
  },
];

function Aperture({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M16 4.5v7.8M27 10.4l-6.8 3.9M27 21.6l-6.8-1.6M16 27.5l2.6-7.2M5 21.6l6.8-3.9M5 10.4l6.8 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3" fill="#ff5b45" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
      <path d="M12 4v16M4 12h16" strokeLinecap="square" />
    </svg>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(FEATURED_ID);
  const [filter, setFilter] = useState<Filter>("Все");
  const [lightbox, setLightbox] = useState<VideoWork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const objectUrls = useRef(new Map<string, string>());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useScrollProgress();

  /* ---------- загрузка своих роликов из IndexedDB ---------- */
  useEffect(() => {
    let cancelled = false;
    loadUserVideos()
      .then((records) => {
        if (cancelled) return;
        const mapped: UserVideo[] = records
          .slice()
          .sort((a, b) => b.addedAt - a.addedAt)
          .map((r) => {
            let src = r.src;
            if (r.kind === "file" && r.blob) {
              const u = URL.createObjectURL(r.blob);
              objectUrls.current.set(r.id, u);
              src = u;
            }
            return {
              id: r.id,
              title: r.title,
              category: r.category,
              year: new Date(r.addedAt).getFullYear(),
              client: r.client,
              role: r.role,
              duration: r.duration,
              src,
              poster: r.poster,
              desc: r.desc,
              tags: ["добавлено вами"],
              kind: r.kind,
            };
          });
        setUserVideos(mapped);
      })
      .catch(() => {
        /* хранилище недоступно — работаем только в рамках сессии */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- тосты ---------- */
  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  };

  /* ---------- добавление ролика ---------- */
  const handleAdd = async (data: NewVideoData) => {
    const id = uid();
    let src = "";
    let blob: Blob | undefined;
    if (data.file) {
      const u = URL.createObjectURL(data.file);
      objectUrls.current.set(id, u);
      src = u;
      blob = data.file;
    } else if (data.url) {
      src = data.url;
    }

    const record: StoredVideo = {
      id,
      kind: data.file ? "file" : "url",
      title: data.title,
      category: data.category,
      client: data.client || "Свой проект",
      role: "Автор",
      desc: data.desc || "Ролик из личного архива.",
      src: data.file ? "" : src,
      poster: data.poster,
      duration: data.duration,
      addedAt: Date.now(),
      blob,
    };

    let persisted = true;
    try {
      await saveUserVideo(record);
    } catch {
      persisted = false;
    }

    const work: UserVideo = {
      id,
      title: data.title,
      category: data.category,
      year: new Date().getFullYear(),
      client: record.client,
      role: "Автор",
      duration: data.duration,
      src,
      poster: data.poster,
      desc: record.desc,
      tags: ["добавлено вами"],
      kind: record.kind,
    };

    setUserVideos((prev) => [work, ...prev]);
    setModalOpen(false);
    showToast(
      persisted
        ? `«${data.title}» добавлен в архив`
        : `«${data.title}» добавлен (хранилище недоступно — проживёт до перезагрузки)`
    );
  };

  /* ---------- удаление ролика ---------- */
  const handleRemove = (id: string) => {
    const v = userVideos.find((x) => x.id === id);
    if (!v) return;
    const u = objectUrls.current.get(id);
    if (u) {
      URL.revokeObjectURL(u);
      objectUrls.current.delete(id);
    }
    deleteUserVideo(id).catch(() => {});
    setUserVideos((prev) => prev.filter((x) => x.id !== id));
    if (lightbox?.id === id) setLightbox(null);
    showToast(`«${v.title}» удалён из архива`);
  };

  /* ---------- сводный архив ---------- */
  const allVideos = useMemo<UserVideo[]>(() => [...userVideos, ...(VIDEOS as UserVideo[])], [userVideos]);

  const active = useMemo(
    () => allVideos.find((v) => v.id === activeId) ?? allVideos[0],
    [allVideos, activeId]
  );

  const queue = useMemo(() => {
    const idx = allVideos.findIndex((v) => v.id === active.id);
    return [...allVideos.slice(idx + 1), ...allVideos.slice(0, idx)].slice(0, 6);
  }, [allVideos, active.id]);

  const filtered = useMemo(
    () => (filter === "Все" ? allVideos : allVideos.filter((v) => v.category === filter)),
    [allVideos, filter]
  );

  const goToNext = () => {
    const idx = allVideos.findIndex((v) => v.id === active.id);
    setActiveId(allVideos[(idx + 1) % allVideos.length].id);
  };

  const lightboxList = filtered.length ? filtered : allVideos;
  const lightboxPosition = lightbox
    ? `${String(lightboxList.findIndex((v) => v.id === lightbox.id) + 1).padStart(2, "0")} / ${String(
        lightboxList.length
      ).padStart(2, "0")}`
    : "";

  const stepInList = (dir: 1 | -1) => {
    if (!lightbox) return;
    const idx = lightboxList.findIndex((v) => v.id === lightbox.id);
    setLightbox(lightboxList[(idx + dir + lightboxList.length) % lightboxList.length]);
  };

  return (
    <div className="relative min-h-screen font-body text-bone">
      {/* фоновые слои */}
      <div className="ambient" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* ---------- шапка ---------- */}
      <header className="sticky top-0 z-50 border-b border-line bg-coal-950/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#showreel" className="group flex items-center gap-3 text-bone">
            <Aperture className="h-8 w-8 text-ember transition-transform duration-500 group-hover:rotate-90" />
            <span className="leading-none">
              <span className="block font-display text-lg font-black tracking-wide">КАДР</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-bone-dim">
                видеопродакшн
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-xs uppercase tracking-[0.25em] text-bone-dim transition-colors hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="hidden items-center gap-2 border border-ember bg-ember px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-coal-950 transition-all hover:-translate-y-0.5 hover:bg-ember-soft sm:flex"
            >
              <PlusIcon />
              Добавить видео
            </button>
            <div className="flex items-center gap-3 border border-line bg-coal-900 px-3 py-1.5">
              <span className="blink h-2 w-2 rounded-full bg-signal" aria-hidden />
              <Timecode className="text-xs text-ember-soft" />
            </div>
          </div>
        </div>
        {/* прогресс чтения */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-ember transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </header>

      <main className="relative z-10">
        {/* ---------- смотровая ---------- */}
        <section id="showreel" className="scroll-mt-20 pt-10 sm:pt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8 sm:mb-12">
              <div>
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone-dim">
                  <span className="inline-block h-px w-10 bg-ember" aria-hidden />
                  Смотровая лента · {allVideos.length} роликов
                </p>
                <h1 className="mt-4 font-display text-5xl font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">
                  <Scramble text="ШОУРИЛ" delay={250} />
                  <span className="text-ember">’26</span>
                </h1>
              </div>
              <Reveal delay={200} className="max-w-xs">
                <p className="text-sm leading-relaxed text-bone-dim">
                  Работы из архива — от открытой анимации до автодрайва. Жмите play или наводите
                  курсор на карточки: превью запускается само. Свои ролики добавляются кнопкой
                  «Добавить видео».
                </p>
              </Reveal>
            </div>

            <Reveal>
              <Stage video={active} queue={queue} onSelect={setActiveId} onEnded={goToNext} />
            </Reveal>
          </div>
        </section>

        {/* ---------- бегущая строка ---------- */}
        <div className="mt-16 sm:mt-24">
          <Marquee />
        </div>

        {/* ---------- архив работ ---------- */}
        <section id="works" className="scroll-mt-20 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
                <Reveal variant="mask">
                  <span>
                    АРХИВ <span className="text-ember">РАБОТ</span>
                  </span>
                </Reveal>
              </h2>
              <Reveal delay={150}>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 border border-ember bg-ember px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 transition-all hover:-translate-y-0.5 hover:bg-ember-soft"
                  >
                    <PlusIcon />
                    Добавить видео
                  </button>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim">
                    показано <span className="text-ember">{String(filtered.length).padStart(2, "0")}</span> из{" "}
                    {String(allVideos.length).padStart(2, "0")}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* фильтры */}
            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const count = c === "Все" ? allVideos.length : allVideos.filter((v) => v.category === c).length;
                  const isActive = filter === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-all duration-200 ${
                        isActive
                          ? "border-ember bg-ember font-bold text-coal-950"
                          : "border-line text-bone-dim hover:-translate-y-0.5 hover:border-ember/60 hover:text-bone"
                      }`}
                    >
                      {c}
                      <span className={isActive ? "text-coal-950/60" : "text-coal-600"}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* сетка */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v, i) => (
                <Reveal key={v.id} delay={(i % 3) * 90}>
                  <VideoCard
                    video={v}
                    index={allVideos.indexOf(v)}
                    onOpen={(work) => setLightbox(work)}
                    onRemove={v.kind ? () => handleRemove(v.id) : undefined}
                  />
                </Reveal>
              ))}
            </div>

            {userVideos.length === 0 && (
              <Reveal delay={200}>
                <button
                  onClick={() => setModalOpen(true)}
                  className="group mt-10 flex w-full items-center justify-center gap-4 border-2 border-dashed border-coal-600 px-6 py-8 text-center transition-all duration-300 hover:border-ember/70 hover:bg-coal-900"
                >
                  <span className="flex h-10 w-10 items-center justify-center border border-ember text-ember transition-transform duration-300 group-hover:rotate-90">
                    <PlusIcon />
                  </span>
                  <span>
                    <span className="block font-display text-base font-bold text-bone">
                      Здесь появится ваш ролик
                    </span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                      загрузите файл или вставьте ссылку — сохранится в этом браузере
                    </span>
                  </span>
                </button>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------- процесс ---------- */}
        <section id="process" className="scroll-mt-20 border-t border-line bg-coal-900/40 py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
            {/* sticky-колонка */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-ember">
                <span className="inline-block h-px w-10 bg-ember" aria-hidden />
                Процесс
              </p>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                <Reveal variant="mask">
                  <span>От брифа до</span>
                </Reveal>
                <Reveal variant="mask" delay={120}>
                  <span>
                    премьеры — <span className="text-ember">4 такта</span>
                  </span>
                </Reveal>
              </h2>
              <Reveal delay={200}>
                <p className="mt-6 text-sm leading-relaxed text-bone-dim">
                  Никакой магии — только понятный конвейер, в котором клиент видит работу на каждом
                  этапе и точно знает, за что платит.
                </p>
                <p className="mt-6 inline-block border border-line bg-coal-900 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                  Средний цикл — <span className="text-ember">3 недели</span>
                </p>
              </Reveal>
            </div>

            {/* шаги */}
            <ol className="border-t border-line">
              {STEPS.map((s, i) => (
                <Reveal key={s.num} delay={i * 100}>
                  <li className="group flex gap-6 border-b border-line py-8 transition-all duration-300 hover:bg-coal-900 hover:pl-4 sm:gap-10 sm:py-10">
                    <span className="font-display text-4xl font-black leading-none text-coal-600 transition-colors duration-300 group-hover:text-ember sm:text-6xl">
                      {s.num}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-extrabold sm:text-2xl">{s.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone-dim">{s.text}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="border border-coal-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone-dim transition-colors group-hover:border-ember/50 group-hover:text-bone"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- цифры ---------- */}
        <div className="mt-0">
          <Stats />
        </div>

        {/* ---------- контакт ---------- */}
        <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-bone-dim">
                <span className="inline-block h-px w-10 bg-signal" aria-hidden />
                Финальные титры
              </p>
              <h2 className="mt-6 font-display font-black leading-[0.95] tracking-tight">
                <Reveal variant="mask">
                  <span className="block text-5xl sm:text-7xl">ЕСТЬ ИДЕЯ?</span>
                </Reveal>
                <Reveal variant="mask" delay={140}>
                  <span className="block text-5xl text-ember sm:text-7xl">СНИМЕМ.</span>
                </Reveal>
              </h2>
              <Reveal delay={250}>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-bone-dim">
                  Расскажите о задаче в двух предложениях — в ответ пришлю референсы, оценку сроков
                  и бюджетную вилку. Без созвонов «на 15 минут», которые длятся час.
                </p>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div className="border border-line bg-coal-900">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">Каналы связи</span>
                  <span className="blink h-2 w-2 rounded-full bg-ember" aria-hidden />
                </div>
                <div className="divide-y divide-line">
                  <a
                    href="mailto:hello@kadr.video"
                    className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-coal-850"
                  >
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">Почта</span>
                      <span className="u-sweep mt-1 inline-block font-display text-lg font-bold sm:text-xl">
                        hello@kadr.video
                      </span>
                    </span>
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-coal-600 transition-all group-hover:translate-x-1 group-hover:text-ember" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14m-6-7 7 7-7 7" strokeLinecap="square" />
                    </svg>
                  </a>
                  <a
                    href="https://t.me/kadr_video"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-coal-850"
                  >
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">Телеграм</span>
                      <span className="u-sweep mt-1 inline-block font-display text-lg font-bold sm:text-xl">@kadr_video</span>
                    </span>
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-coal-600 transition-all group-hover:translate-x-1 group-hover:text-ember" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14m-6-7 7 7-7 7" strokeLinecap="square" />
                    </svg>
                  </a>
                  <div className="px-6 py-5">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">Режим</span>
                    <span className="mt-1 block text-sm text-bone">
                      Отвечаю в течение дня · съёмки — Москва и весь мир
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------- подвал ---------- */}
      <footer className="relative z-10">
        <div className="perf" aria-hidden />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <Aperture className="h-7 w-7 text-ember" />
            <div>
              <p className="font-display text-base font-black leading-none">КАДР</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
                © 2026 · студия одного кадра
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="u-sweep font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="text-left sm:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
              25 fps · Москва <Timecode className="text-ember-soft" />
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-wider text-coal-600">
              Снято на свету. Смонтировано в темноте.
            </p>
          </div>
        </div>
      </footer>

      {/* ---------- модалки ---------- */}
      {modalOpen && <AddVideoModal onClose={() => setModalOpen(false)} onAdd={handleAdd} />}

      {lightbox && (
        <Lightbox
          video={lightbox}
          position={lightboxPosition}
          onClose={() => setLightbox(null)}
          onPrev={() => stepInList(-1)}
          onNext={() => stepInList(1)}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} />}
    </div>
  );
}
