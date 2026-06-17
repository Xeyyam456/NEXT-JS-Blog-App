import styles from "./Kicker.module.css";

export default function Kicker({ children, tone = "default", className = "" }) {
  const toneClassName = tone === "muted" ? styles.muted : "";
  const mergedClassName = [styles.kicker, toneClassName, className]
    .filter(Boolean)
    .join(" ");

  return <p className={mergedClassName}>{children}</p>;
}
