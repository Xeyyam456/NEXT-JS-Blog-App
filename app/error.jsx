"use client";

import { StatusPanel } from "@/shared/ui";

export default function Error({ error, reset }) {
  return (
    <StatusPanel
      kicker="Request failed"
      title="The newsroom could not load this page."
      description={error?.message || "Unexpected error."}
      actionLabel="Reload Page"
      onAction={reset}
    />
  );
}