import { useState } from "react";
import { api } from "../api/mockApi";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const result = await api.login(password);
    setLoading(false);
    
    if (result.success) {
      onLogin();
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-coal-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-black text-bone">АДМИНКА</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-bone-dim">
            PRIPLAD.ONLINE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-coal-600 bg-coal-900 px-4 py-2.5 text-sm text-bone placeholder:text-coal-600 focus:border-ember focus:outline-none"
              placeholder="Введите пароль"
              autoFocus
            />
          </div>

          {error && (
            <p className="border border-signal/50 bg-signal/10 px-3 py-2 font-mono text-xs text-signal">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-ember px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-coal-950 transition-all hover:bg-ember-soft disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] text-coal-600">
          Mock пароль: priplad2026
        </p>
      </div>
    </div>
  );
}
