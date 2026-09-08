import { ReactNode } from "react";
import { api } from "../api/mockApi";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: "videos" | "formats" | "showreel";
  onTabChange: (tab: "videos" | "formats" | "showreel") => void;
  onLogout: () => void;
}

export default function AdminLayout({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) {
  const handleLogout = async () => {
    await api.logout();
    onLogout();
  };

  const tabs = [
    { key: "videos" as const, label: "Видео" },
    { key: "formats" as const, label: "Форматы" },
    { key: "showreel" as const, label: "Шоурил" },
  ];

  return (
    <div className="min-h-screen bg-coal-950 font-body text-bone">
      {/* Шапка админки */}
      <header className="sticky top-0 z-50 border-b border-line bg-coal-950/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-sm font-black tracking-wide">АДМИНКА</h1>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim sm:inline">
              PRIPLAD.ONLINE
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab.key
                    ? "bg-ember text-coal-950"
                    : "text-bone-dim hover:text-bone"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="border border-coal-600 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-signal hover:text-signal"
          >
            Выход
          </button>
        </div>
      </header>

      {/* Контент */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
