import Link from "next/link";
import styles from "./StatusPanel.module.css";

export default function StatusPanel({
  kicker,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <main className={`page-shell ${styles.root}`}>
      <section className={`content-section panel-surface error-panel ${styles.panel}`}>
        <p className="section-kicker">{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        {(actionHref || onAction) ? (
          <div className={styles.actions}>
            {actionHref ? (
              <Link href={actionHref} className="primary-button">
                {actionLabel}
              </Link>
            ) : null}

            {onAction ? (
              <button type="button" onClick={onAction} className="primary-button">
                {actionLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}