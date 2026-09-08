import { useState, useEffect } from "react";
import { api } from "../api/mockApi";
import { AppProvider } from "../store/AppContext";
import LoginPage from "./LoginPage";
import AdminLayout from "./AdminLayout";
import VideosPage from "./VideosPage";
import FormatsPage from "./FormatsPage";
import ShowreelPage from "./ShowreelPage";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "formats" | "showreel">("videos");

  useEffect(() => {
    api.ping().then((auth) => {
      setIsAuth(auth);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-coal-950">
        <p className="font-mono text-sm text-bone-dim">Проверка авторизации...</p>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginPage onLogin={() => setIsAuth(true)} />;
  }

  return (
    <AppProvider>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => setIsAuth(false)}
      >
        {activeTab === "videos" && <VideosPage />}
        {activeTab === "formats" && <FormatsPage />}
        {activeTab === "showreel" && <ShowreelPage />}
      </AdminLayout>
    </AppProvider>
  );
}
