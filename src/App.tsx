import { useState, useEffect } from "react";
import { AppProvider } from "./store/AppContext";
import PublicPage from "./pages/PublicPage";
import AdminPage from "./admin/AdminPage";

function getRoute(): "public" | "admin" {
  // Поддержка как /admin, так и #/admin для гибкости
  const hash = window.location.hash;
  const pathname = window.location.pathname;
  return pathname === "/admin" || hash === "#/admin" || hash === "#admin" ? "admin" : "public";
}

export default function App() {
  const [route, setRoute] = useState<"public" | "admin">(getRoute());

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  return (
    <AppProvider>
      {route === "admin" ? <AdminPage /> : <PublicPage />}
    </AppProvider>
  );
}
