import { create } from "zustand";
import type { Theme, ThemeStore } from "@/types/shared/stores/useThemeStore";

export const THEME_STORAGE_KEY = "pulse-theme";

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    applyThemeToDocument(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme: Theme = get().theme === "dark" ? "light" : "dark";

    get().setTheme(nextTheme);
  },
}));
