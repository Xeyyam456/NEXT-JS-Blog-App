import Button from "../Button";
import Kicker from "../Kicker";
import styles from "./StatusPanel.module.css";
import type { StatusPanelProps } from "@/types/shared/ui/StatusPanel";

export default function StatusPanel({
  kicker,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: StatusPanelProps) {
  return (
    <main className={styles.root}>
      <section className={styles.panel}>
        <Kicker>{kicker}</Kicker>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        {(actionHref || onAction) ? (
          <div className={styles.actions}>
            {actionHref ? (
              <Button href={actionHref}>
                {actionLabel}
              </Button>
            ) : null}

            {onAction ? (
              <Button type="button" onClick={onAction}>
                {actionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
