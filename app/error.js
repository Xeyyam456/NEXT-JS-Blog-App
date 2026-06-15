"use client";

export default function Error({ error, reset }) {
  return (
    <main className="page-shell">
      <section className="content-section panel-surface error-panel">
        <p className="section-kicker">Request failed</p>
        <h1>The newsroom could not load this page.</h1>
        <p>{error?.message || "Unexpected error."}</p>
        <button type="button" onClick={reset} className="primary-button">
          Reload Page
        </button>
      </section>
    </main>
  );
}