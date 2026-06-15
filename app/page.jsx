import { PostCard } from "@/features/posts/components";
import { getPosts } from "@/features/posts/services/server-posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();
  const spotlightPost = posts[0];

  return (
    <main className="page-shell">
      <section className="hero-grid">
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

        <aside className="spotlight-card panel-surface">
          <p className="section-kicker">Spotlight</p>
          {spotlightPost ? (
            <>
              <h2>{spotlightPost.title}</h2>
              <p>{spotlightPost.body}</p>
              <Link href={`/posts/${spotlightPost.id}`} className="text-link">
                Read featured story
              </Link>
            </>
          ) : (
            <>
              <h2>No spotlight yet</h2>
              <p>Publish a post and it will appear here right away.</p>
            </>
          )}
        </aside>
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
          <div className="empty-state">
            <h3>No posts available</h3>
            <p>Use the create page to publish the first article.</p>
          </div>
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
