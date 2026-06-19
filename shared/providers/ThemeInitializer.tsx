"use client";

import { useThemeStore } from "@/shared/stores";
import { useEffect } from "react";
import type { Theme } from "@/types/shared/stores/useThemeStore";

export default function ThemeInitializer() {
  useEffect(() => {
    const documentTheme = document.documentElement.dataset.theme as Theme | undefined;

    if (documentTheme) {
      useThemeStore.setState({ theme: documentTheme });
    }
  }, []);

  return null;
}
