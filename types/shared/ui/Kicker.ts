import type { ReactNode } from "react";

export type KickerProps = {
  children: ReactNode;
  tone?: "default" | "muted";
  className?: string;
};
