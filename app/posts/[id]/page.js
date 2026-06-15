import DeletePostButton from "@/components/DeletePostButton";
import { getPost } from "@/services/server-posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const post = await getPost(id);

    return {
      title: `${post.title} | Pulse Press`,
      description: post.body,
    };
  } catch {
    return {
      title: "Post not found | Pulse Press",
    };
  }
}

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <main className="page-shell">
      <article className="detail-layout panel-surface">
        <div className="detail-column">
          <p className="section-kicker">Post #{post.id}</p>
          <h1>{post.title}</h1>
          <p className="detail-body">{post.body}</p>
        </div>

        <aside className="detail-sidebar">
          <div>
            <p className="sidebar-label">Endpoint</p>
            <p>GET /posts/{post.id}</p>
          </div>

          <div>
            <p className="sidebar-label">Actions</p>
            <div className="detail-actions">
              <Link href={`/posts/${post.id}/edit`} className="primary-button">
                Edit Story
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          </div>
        </aside>
      </article>
    </main>
  );
}