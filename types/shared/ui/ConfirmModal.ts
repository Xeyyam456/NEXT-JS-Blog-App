import type { ReactNode } from "react";

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "secondary" | "danger";
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
};
