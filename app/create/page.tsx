import { PostForm } from "@/features/posts/components";
import { EditorialFormLayout } from "@/shared/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post | Pulse Press",
};

export default function CreatePage() {
  return (
    <EditorialFormLayout
      introKicker="Create story"
      title="Publish a bold new article."
      description="This route stays server-rendered, while the form itself is isolated as a client component for hook-based interaction."
      endpoint="POST /posts"
      endpointSummary="Send title and body to the live API."
    >
      <PostForm mode="create" />
    </EditorialFormLayout>
  );
}
