import { useState, useEffect } from "react";
import { api } from "../api/api";
import { AppProvider } from "../store/AppContext";
import LoginPage from "./LoginPage";
import AdminLayout from "./AdminLayout";
import VideosPage from "./VideosPage";
import FormatsPage from "./FormatsPage";
import ShowreelPage from "./ShowreelPage";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "formats" | "showreel">("videos");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Сначала проверяем доступность API
        await api.ping();
        
        // Затем проверяем авторизацию
        const result = await api.checkAuth();
        setIsAuth(result.authenticated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "API недоступен");
      } finally {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuth(false);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal-950">
        <p className="font-mono text-sm text-bone-dim">Проверка подключения...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal-950 px-4">
        <div className="max-w-md text-center">
          <h2 className="font-display text-xl font-black text-signal">Ошибка подключения</h2>
          <p className="mt-4 font-mono text-sm text-bone-dim">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 border border-ember px-6 py-2 font-mono text-xs uppercase tracking-wider text-ember hover:bg-ember hover:text-coal-950"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      >
        {activeTab === "videos" && <VideosPage />}
        {activeTab === "formats" && <FormatsPage />}
        {activeTab === "showreel" && <ShowreelPage />}
      </AdminLayout>
    </AppProvider>
  );
}
