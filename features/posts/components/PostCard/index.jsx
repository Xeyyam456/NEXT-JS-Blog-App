import Link from "next/link";
import styles from "./PostCard.module.css";

export default function PostCard({ post }) {
  return (
    <article className={styles.card}>
      <div className={styles.topline}>
        <span className="section-chip muted-chip">Post #{post.id}</span>
        <span className="reading-time">Live entry</span>
      </div>

      <div className={styles.content}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>

      <div className={styles.actions}>
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