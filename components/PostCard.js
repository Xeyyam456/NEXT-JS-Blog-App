import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card-topline">
        <span className="section-chip muted-chip">Post #{post.id}</span>
        <span className="reading-time">Live entry</span>
      </div>

      <div className="post-card-content">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>

      <div className="post-card-actions">
        <Link href={`/posts/${post.id}`} className="primary-button small-button">
          Open Story
        </Link>
        <Link
          href={`/posts/${post.id}/edit`}
          className="secondary-button small-button"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}