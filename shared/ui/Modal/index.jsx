"use client";

import { useModalLifecycle } from "@/shared/hooks";
import Kicker from "../Kicker";
import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) {
  useModalLifecycle({ isOpen, onClose });

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.orbPrimary} />
        <div className={styles.orbSecondary} />
        <div className={styles.gridPattern} />

        <div className={styles.header}>
          <div className={styles.headingGroup}>
            <Kicker className={styles.kicker}>Dialog</Kicker>
            <h2 id="shared-modal-title" className={styles.title}>{title}</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {description ? (
          <div className={styles.copyBlock}>
            <p className={styles.description}>{description}</p>
          </div>
        ) : null}

        {children ? <div className={styles.body}>{children}</div> : null}

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
