"use client";

import { useThemeStore } from "@/shared/stores";
import { Toaster } from "sonner";
import styles from "./AppToaster.module.css";

export default function AppToaster() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Toaster
      richColors
      closeButton
      theme={theme}
      position="top-right"
      toastOptions={{
        className: styles.toast,
      }}
    />
  );
}
