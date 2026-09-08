import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AppData, Video, Format, Showreel } from "../types";
import { api } from "../api/mockApi";

interface AppContextType {
  data: AppData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  // Видео
  addVideo: (video: Omit<Video, "id">) => Promise<void>;
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  reorderVideos: (formatId: string, videoIds: string[]) => Promise<void>;
  // Форматы
  addFormat: (format: Omit<Format, "id">) => Promise<void>;
  updateFormat: (id: string, updates: Partial<Format>) => Promise<void>;
  deleteFormat: (id: string) => Promise<void>;
  // Showreel
  updateShowreel: (showreel: Showreel) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const d = await api.data();
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const addVideo = async (video: Omit<Video, "id">) => {
    await api.addVideo(video);
    await refresh();
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    await api.updateVideo(id, updates);
    await refresh();
  };

  const deleteVideo = async (id: string) => {
    await api.deleteVideo(id);
    await refresh();
  };

  const reorderVideos = async (formatId: string, videoIds: string[]) => {
    await api.reorderVideos(formatId, videoIds);
    await refresh();
  };

  const addFormat = async (format: Omit<Format, "id">) => {
    await api.addFormat(format);
    await refresh();
  };

  const updateFormat = async (id: string, updates: Partial<Format>) => {
    await api.updateFormat(id, updates);
    await refresh();
  };

  const deleteFormat = async (id: string) => {
    await api.deleteFormat(id);
    await refresh();
  };

  const updateShowreel = async (showreel: Showreel) => {
    await api.updateShowreel(showreel);
    await refresh();
  };

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        refresh,
        addVideo,
        updateVideo,
        deleteVideo,
        reorderVideos,
        addFormat,
        updateFormat,
        deleteFormat,
        updateShowreel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
