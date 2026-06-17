import { PostForm } from "@/features/posts/components";
import { getPost } from "@/services/posts.server";
import { EditorialFormLayout } from "@/shared/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Edit Post ${id} | Pulse Press`,
  };
}

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  const visibleId = post.displayId ?? post.id;

  return (
    <EditorialFormLayout
      introKicker="Edit story"
      title={`Refine post #${visibleId}`}
      description="Current content is loaded on the server first, then passed into the client form for editing."
      endpoint={`PUT /posts/${post.id}`}
      endpointSummary="Update the article and publish changes."
    >
      <PostForm mode="edit" post={post} />
    </EditorialFormLayout>
  );
}