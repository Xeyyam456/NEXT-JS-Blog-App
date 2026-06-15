import styles from "./EditorialFormLayout.module.css";

export default function EditorialFormLayout({
  introKicker,
  title,
  description,
  endpoint,
  endpointSummary,
  children,
}) {
  return (
    <main className={`page-shell ${styles.root}`}>
      <section className={`panel-surface ${styles.layout}`}>
        <div className={styles.intro}>
          <p className="section-kicker">{introKicker}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className={styles.formShell}>
          <div className={styles.headline}>
            <div>
              <p className="section-kicker">Endpoint</p>
              <h2>{endpoint}</h2>
            </div>
            <p className={styles.summary}>{endpointSummary}</p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}