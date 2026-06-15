"use client";

import { StatusPanel } from "@/shared/ui";

export default function Error({ error, reset }) {
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