import { PostsGrid } from "@/features/posts/components";
import { getPosts } from "@/services/posts.server";
import { EmptyState, Kicker } from "@/shared/ui";
import type { Metadata } from "next";
import styles from "./PostsPage.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts | Pulse Press",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className={styles.shell}>
      <section className={`${styles.contentSection} ${styles.panel}`}>
        <div className={styles.sectionHeadline}>
          <div>
            <Kicker>Full Archive</Kicker>
            <h1>All your stories</h1>
          </div>
          <p className={styles.sectionSummary}>
            Every post created from this browser, in one place.
          </p>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            kicker="Your archive is empty"
            title="Only your own posts appear here"
            description="This list shows only the stories created from this browser. Publish a new post and it will appear here immediately."
            actionLabel="Write New Post"
            actionHref="/create"
          />
        ) : (
          <PostsGrid posts={posts} />
        )}
      </section>
    </main>
  );
}
