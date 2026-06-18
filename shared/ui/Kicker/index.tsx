import styles from "./Kicker.module.css";
import type { KickerProps } from "@/types/shared/ui/Kicker";

export default function Kicker({ children, tone = "default", className = "" }: KickerProps) {
  const toneClassName = tone === "muted" ? styles.muted : "";
  const mergedClassName = [styles.kicker, toneClassName, className]
    .filter(Boolean)
    .join(" ");

  return <p className={mergedClassName}>{children}</p>;
}
