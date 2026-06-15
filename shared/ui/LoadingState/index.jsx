import styles from "./LoadingState.module.css";

export default function LoadingState({
  kicker = "Loading",
  title = "Pulling stories from the API...",
  description,
  skeletonCount = 4,
}) {
  return (
    <main className="page-shell">
      <section className={`content-section panel-surface ${styles.panel}`}>
        <div className={styles.header}>
          <p className="section-kicker">{kicker}</p>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      </section>
    </main>
  );
}