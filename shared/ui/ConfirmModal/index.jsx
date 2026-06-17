"use client";

import Button from "../Button";
import Modal from "../Modal";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  isPending = false,
  onConfirm,
  onClose,
  children,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : onClose}
      title={title}
      description={description}
      footer={(
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isPending}
          >
            {confirmLabel}
          </Button>
        </>
      )}
    >
      {children ? <div className={styles.body}>{children}</div> : null}
    </Modal>
  );
}
