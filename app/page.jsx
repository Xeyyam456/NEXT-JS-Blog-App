import { PostCard } from "@/features/posts/components";
import { getPosts } from "@/services/server-posts";
import { EmptyState } from "@/shared/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="page-shell">
      <section className="hero-grid hero-grid-wide">
        <article className="hero-story panel-surface">
          <div className="hero-copy">
            <span className="section-chip">Live API Journal</span>
            <h1>Write, refine, and publish stories with a real server-rendered workflow.</h1>
            <p>
              The listing and detail screens render on the server, while create,
              edit, and delete interactions stay inside dedicated client components.
            </p>
          </div>

          <div className="hero-actions">
            <Link href="/create" className="primary-button">
              Write New Post
            </Link>
            <Link href="/posts" className="secondary-button">
              Browse Archive
            </Link>
          </div>

          <div className="metric-strip">
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

      <section className="content-section panel-surface">
        <div className="section-headline">
          <div>
            <p className="section-kicker">Fresh from the API</p>
            <h2>Server-rendered stories</h2>
          </div>
          <p className="section-summary">
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
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
