import "../styles/globals.css";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { AppErrorBoundary, AppToaster } from "@/shared/providers";
import Link from "next/link";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Pulse Press",
  description: "Server-rendered CRUD blog app powered by a real API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <div className="site-backdrop" />
        <div className="site-frame">
          <header className="site-header">
            <Link href="/" className="brand-mark">
              <span>Pulse</span>
              <span>Press</span>
            </Link>

            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/posts">Posts</Link>
              <Link href="/create">Create</Link>
            </nav>
          </header>

          <AppErrorBoundary>{children}</AppErrorBoundary>
        </div>
        <AppToaster />
      </body>
    </html>
  );
}
