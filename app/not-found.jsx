import { StatusPanel } from "@/shared/ui";

export default function NotFound() {
  return (
    <StatusPanel
      kicker="404"
      title="This story is missing from the archive."
      description="The requested post does not exist or is no longer available."
      actionLabel="Return Home"
      actionHref="/"
    />
  );
}