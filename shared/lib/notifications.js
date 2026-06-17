"use client";

import { toast } from "sonner";

export function notifySuccess(message, description) {
  toast.success(message, {
    description,
  });
}

export function notifyError(message, description) {
  toast.error(message, {
    description,
  });
}

export function notifyInfo(message, description) {
  toast.warning(message, {
    description,
  });
}