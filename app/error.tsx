"use client";

import { StatusPanel } from "@/shared/ui";
import type { ErrorPageProps } from "@/types/app/error";

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <StatusPanel
      kicker="Something went wrong"
      title="Page load failed."
      description={error?.message || "Please refresh and try again."}
      actionLabel="Try again"
      onAction={reset}
    />
  );
}
