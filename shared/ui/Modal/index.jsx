"use client";

import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={`panel-surface ${styles.panel}`}
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
            <p className={`section-kicker ${styles.kicker}`}>Dialog</p>
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