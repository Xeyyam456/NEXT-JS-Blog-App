"use client";

import { toast } from "sonner";

export function notifySuccess(message: string, description?: string): void {
  toast.success(message, {
    description,
  });
}

export function notifyError(message: string, description?: string): void {
  toast.error(message, {
    description,
  });
}

export function notifyInfo(message: string, description?: string): void {
  toast.warning(message, {
    description,
  });
}
