import Kicker from "../Kicker";
import styles from "./LoadingState.module.css";
import type { LoadingStateProps } from "@/types/shared/ui/LoadingState";

export default function LoadingState({
  kicker = "Loading",
  title = "Pulling stories from the API...",
  description,
  skeletonCount = 4,
}: LoadingStateProps) {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <Kicker>{kicker}</Kicker>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        <div className={styles.skeletonGrid} aria-hidden="true">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    </main>
  );
}
