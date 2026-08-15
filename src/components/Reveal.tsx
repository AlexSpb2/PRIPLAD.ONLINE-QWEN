import type { CSSProperties, MutableRefObject, ReactNode, Ref } from "react";
import { useInView } from "../lib/hooks";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: "up" | "mask";
  className?: string;
}

/** Обёртка появления при скролле: сдвиг снизу либо «выезд» из маски-строки. */
export default function Reveal({ children, delay = 0, variant = "up", className = "" }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const style = { "--rv-delay": `${delay}ms` } as CSSProperties;

  if (variant === "mask") {
    return (
      <span ref={ref as unknown as Ref<HTMLSpanElement>} className={`rv-mask ${inView ? "in" : ""} ${className}`} style={style}>
        <span className="rv-mask-inner">{children}</span>
      </span>
    );
  }

  return (
    <div ref={ref as MutableRefObject<HTMLDivElement | null>} className={`rv ${inView ? "in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}
