export default function Loading() {
  return (
    <main className="page-shell">
      <section className="content-section panel-surface loading-panel">
        <p className="section-kicker">Loading</p>
        <h1>Pulling stories from the API...</h1>
        <div className="skeleton-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      </section>
    </main>
  );
}