import Image from "next/image";
import DeletePostButton from "../DeletePostButton";
import { Button, Kicker } from "@/shared/ui";
import styles from "./PostCard.module.css";

export default function PostCard({ post }) {
  const visibleId = post.displayId ?? post.id;

  return (
    <article className={styles.card}>
      {post.imageUrl ? (
        <div className={styles.media}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 980px) 100vw, 33vw"
            className={styles.image}
          />
        </div>
      ) : null}

      <div className={styles.topline}>
        <Kicker tone="muted">Post #{visibleId}</Kicker>
        <span className={styles.readingTime}>Live entry</span>
      </div>

      <div className={styles.content}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.primaryActions}>
          <Button href={`/posts/${post.id}`} variant="primary" size="xsmall">
            Open Story
          </Button>
          <Button
            href={`/posts/${post.id}/edit`}
            variant="secondary"
            size="xsmall"
          >
            Edit
          </Button>
        </div>
        <DeletePostButton
          postId={post.id}
          buttonLabel="Remove"
          buttonSize="xsmall"
          showInlineError={false}
        />
      </div>
    </article>
  );
}
