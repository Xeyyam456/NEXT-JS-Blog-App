import PostForm from "@/components/PostForm";
import { getPost } from "@/services/server-posts";

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

  return (
    <main className="page-shell">
      <section className="form-layout panel-surface">
        <div className="form-intro">
          <p className="section-kicker">Edit story</p>
          <h1>Refine post #{post.id}</h1>
          <p>
            Current content is loaded on the server first, then passed into the
            client form for editing.
          </p>
        </div>

        <div className="post-form-shell">
          <div className="section-headline compact-headline">
          <div>
            <p className="section-kicker">Endpoint</p>
            <h2>PUT /posts/{post.id}</h2>
          </div>
          <p className="section-summary">Update the article and publish changes.</p>
        </div>
        <PostForm mode="edit" post={post} />
        </div>
      </section>
    </main>
  );
}