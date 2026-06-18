import Kicker from "../Kicker";
import styles from "./EditorialFormLayout.module.css";
import type { EditorialFormLayoutProps } from "@/types/shared/ui/EditorialFormLayout";

export default function EditorialFormLayout({
  introKicker,
  title,
  description,
  endpoint,
  endpointSummary,
  children,
}: EditorialFormLayoutProps) {
  return (
    <main className={styles.root}>
      <section className={styles.layout}>
        <div className={styles.intro}>
          <Kicker>{introKicker}</Kicker>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className={styles.formShell}>
          <div className={styles.headline}>
            <div>
              <Kicker>Endpoint</Kicker>
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
