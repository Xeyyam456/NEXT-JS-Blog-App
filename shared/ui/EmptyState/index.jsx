import Button from "../Button";
import Kicker from "../Kicker";
import styles from "./EmptyState.module.css";

export default function EmptyState({
  kicker = "Nothing here yet",
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className={styles.root}>
      <Kicker>{kicker}</Kicker>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {actionHref && actionLabel ? (
        <div className={styles.actions}>
          <Button href={actionHref}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
