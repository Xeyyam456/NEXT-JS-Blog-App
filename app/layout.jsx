import "../styles/globals.css";
import { AppToaster } from "@/shared/providers";
import Link from "next/link";
import styles from "./layout.module.css";

export const metadata = {
  title: "Pulse Press",
  description: "Server-rendered CRUD blog app powered by internal API routes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.backdrop} />
        <div className={styles.frame}>
          <header className={styles.header}>
            <Link href="/" className={styles.brand}>
              <span>Pulse</span>
              <span>Press</span>
            </Link>

            <nav className={styles.nav}>
              <Link href="/posts">Posts</Link>
              <Link href="/create">Create</Link>
            </nav>
          </header>

          {children}
        </div>
        <AppToaster />
      </body>
    </html>
  );
}
