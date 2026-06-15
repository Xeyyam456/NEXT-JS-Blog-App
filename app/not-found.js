import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="content-section panel-surface error-panel">
        <p className="section-kicker">404</p>
        <h1>This story is missing from the archive.</h1>
        <p>The requested post does not exist or is no longer available.</p>
        <Link href="/" className="primary-button">
          Return Home
        </Link>
      </section>
    </main>
  );
}