interface ToastProps {
  message: string;
}

/** Всплывающее уведомление в правом нижнем углу. */
export default function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="lightbox-in fixed bottom-6 right-6 z-[90] flex max-w-[calc(100vw-3rem)] items-center gap-3 border border-ember/60 bg-coal-900 px-5 py-3.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ember" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M4 12.5l5 5L20 6.5" strokeLinecap="square" />
      </svg>
      <p className="text-sm font-semibold text-bone">{message}</p>
    </div>
  );
}
