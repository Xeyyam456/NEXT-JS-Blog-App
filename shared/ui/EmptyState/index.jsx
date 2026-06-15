import Link from "next/link";
import styles from "./EmptyState.module.css";

export default function EmptyState({
  kicker = "Nothing here yet",
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className={styles.root}>
      <p className="section-kicker">{kicker}</p>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {actionHref && actionLabel ? (
        <div className={styles.actions}>
          <Link href={actionHref} className="primary-button">
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}