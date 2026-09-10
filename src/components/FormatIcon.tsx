interface FormatIconProps {
  formatName?: string;
  icon?: string;
  className?: string;
}

/** Монохромная иконка формата. Значение icon из БД имеет приоритет. */
export default function FormatIcon({ formatName = "", icon, className = "h-3 w-3" }: FormatIconProps) {
  const storedIcon = icon?.trim();

  // Для старых записей с emoji сохраняем знакомые SVG, но в монохромном виде.
  if (!storedIcon || ["🎭", "💬", "🎉"].includes(storedIcon)) {
    if (storedIcon === "🎭" || (!storedIcon && formatName.includes("Нейророзыгрыш"))) {
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    }

    if (storedIcon === "💬" || (!storedIcon && formatName.includes("Одним словом"))) {
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" />
        </svg>
      );
    }

    if (storedIcon === "🎉" || (!storedIcon && (formatName.includes("героя") || formatName.includes("праздник")))) {
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeLinejoin="round" />
        </svg>
      );
    }
  }

  if (storedIcon) {
    return (
      <span className={`${className} inline-flex items-center justify-center grayscale`} aria-hidden>
        {storedIcon.slice(0, 2)}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" strokeLinejoin="round" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
