import Image from "next/image";
import { DeletePostButton } from "@/features/posts/components";
import { getPost } from "@/services/server-posts";
import { Button, Kicker } from "@/shared/ui";
import styles from "./PostDetailPage.module.css";

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
  const visibleId = post.displayId ?? post.id;

  return (
    <main className={styles.shell}>
      <article className={styles.layout}>
        <div className={styles.column}>
          <Kicker>Post #{visibleId}</Kicker>
          <h1>{post.title}</h1>
          {post.imageUrl ? (
            <div className={styles.coverMedia}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                unoptimized
                sizes="(max-width: 980px) 100vw, 66vw"
                className={styles.coverImage}
              />
            </div>
          ) : null}
          <p className={styles.body}>{post.body}</p>
        </div>

        <aside className={styles.sidebar}>
          <div>
            <p className={styles.sidebarLabel}>Endpoint</p>
            <p>GET /posts/{post.id}</p>
          </div>

          <div>
            <p className={styles.sidebarLabel}>Actions</p>
            <div className={styles.actions}>
              <Button href={`/posts/${post.id}/edit`}>
                Edit Story
              </Button>
              <DeletePostButton postId={post.id} />
            </div>
          </div>
        </aside>
      </article>
    </main>
  );
}
