import "../styles/globals.css";
import { AppToaster } from "@/shared/providers";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./layout.module.css";
import type { RootLayoutProps } from "@/types/app/layout";

export const metadata: Metadata = {
  title: "Pulse Press",
  description: "Server-rendered CRUD blog app powered by internal API routes",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className={styles.frame}>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link href="/" className={styles.brand}>
                <span>Pulse</span>
                <span>Press</span>
              </Link>

              <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/posts">Posts</Link>
                <Link href="/create">Create</Link>
              </nav>
            </div>
          </header>

          {children}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.brand}>
                <span>Pulse</span>
                <span>Press</span>
              </Link>
              <p>Server-rendered stories, written and published in real time.</p>
            </div>

            <div className={styles.footerLinkGroup}>
              <span>Navigate</span>
              <Link href="/">Home</Link>
              <Link href="/posts">Posts</Link>
              <Link href="/create">Create</Link>
            </div>

            <div className={styles.footerLinkGroup}>
              <span>Status</span>
              <span className={styles.statusLine}>
                <span className={styles.statusDot} />
                API connection live
              </span>
              <span className={styles.statusNote}>Posts shown here are scoped to this browser.</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© 2026 Pulse Press</span>
            <span>Built with Next.js &amp; React</span>
          </div>
        </footer>

        <AppToaster />
      </body>
    </html>
  );
}
