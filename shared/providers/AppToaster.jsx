"use client";

import { Toaster } from "sonner";
import styles from "./AppToaster.module.css";

export default function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        className: styles.toast,
      }}
    />
  );
}
