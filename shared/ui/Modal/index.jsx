"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
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
  const titleId = useId();

  useModalLifecycle({ isOpen, onClose });

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.orbPrimary} />
        <div className={styles.orbSecondary} />
        <div className={styles.gridPattern} />

        <div className={styles.header}>
          <div className={styles.headingGroup}>
            <Kicker className={styles.kicker}>Dialog</Kicker>
            <h2 id={titleId} className={styles.title}>{title}</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <span aria-hidden="true">&times;</span>
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
    </div>,
    document.body
  );
}
