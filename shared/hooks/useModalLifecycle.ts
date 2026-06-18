"use client";

import { useEffect } from "react";
import type { UseModalLifecycleParams } from "@/types/shared/hooks/useModalLifecycle";

export default function useModalLifecycle({ isOpen, onClose }: UseModalLifecycleParams): void {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
}
