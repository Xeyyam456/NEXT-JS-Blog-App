import { PostCard } from "@/features/posts/components";
import { getPosts } from "@/services/posts.server";
import { Button, EmptyState, Kicker } from "@/shared/ui";
import styles from "./HomePage.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className={styles.shell}>
      <section className={styles.heroGrid}>
        <article className={`${styles.heroStory} ${styles.panel}`}>
          <div className={styles.heroCopy}>
            <Kicker>Live API Journal</Kicker>
            <h1>Write, refine, and publish stories with a real server-rendered workflow.</h1>
            <p>
              The listing and detail screens render on the server, while create,
              edit, and delete interactions stay inside dedicated client components.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Button href="/create">
              Write New Post
            </Button>
            <Button href="/posts" variant="secondary">
              Browse Archive
            </Button>
          </div>

          <div className={styles.metricStrip}>
            <div>
              <strong>{posts.length}</strong>
              <span>Live posts</span>
            </div>
            <div>
              <strong>SSR</strong>
              <span>Dynamic route rendering</span>
            </div>
            <div>
              <strong>Axios</strong>
              <span>Centralized services</span>
            </div>
          </div>
        </article>
      </section>

      <section className={`${styles.contentSection} ${styles.panel}`}>
        <div className={styles.sectionHeadline}>
          <div>
            <Kicker>Fresh from the API</Kicker>
            <h2>Server-rendered stories</h2>
          </div>
          <p className={styles.sectionSummary}>
            Editorial card layout with direct access to detail and edit routes.
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
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
