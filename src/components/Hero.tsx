import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-4 text-center sm:px-6 sm:py-5">
      <Reveal>
        <h1 className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-dim sm:text-[11px]">
          <Scramble text="АЛЕКСЕЙ ПРИПЛАД" delay={100} />
        </h1>
      </Reveal>

      <Reveal delay={150}>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-bone-dim sm:text-sm">
          Создаю видео с помощью AI-инструментов. От идеи до готового ролика — промпты, генерация, монтаж.
        </p>
      </Reveal>
    </section>
  );
}
