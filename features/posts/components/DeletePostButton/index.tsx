"use client";

import { useDeletePost } from "@/features/posts/hooks";
import { useDisclosure } from "@/shared/hooks";
import { notifyInfo } from "@/shared/lib/notifications";
import { Button, ConfirmModal } from "@/shared/ui";
import styles from "./DeletePostButton.module.css";
import type { DeletePostButtonProps } from "@/types/features/posts/components/DeletePostButton";

export default function DeletePostButton({
  postId,
  buttonLabel = "Delete Story",
  buttonSize,
  showInlineError = true,
}: DeletePostButtonProps) {
  const { isOpen, open, close } = useDisclosure();
  const { error, isDeleting, handleDelete } = useDeletePost(postId);

  async function handleConfirmDelete() {
    const result = await handleDelete();

    if (result) {
      close();
    }
  }

  return (
    <div className={styles.root}>
      <Button
        type="button"
        onClick={open}
        variant="danger"
        size={buttonSize}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : buttonLabel}
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => {
          if (isDeleting) {
            return;
          }

          close();
          notifyInfo("Delete cancelled", "The post was kept unchanged.");
        }}
        title="Delete this story?"
        description="This action permanently removes the post from the live API and cannot be undone."
        cancelLabel="Keep Story"
        confirmLabel={isDeleting ? "Deleting..." : "Confirm Delete"}
        confirmVariant="danger"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
      />

      {showInlineError && error ? (
        <p className={styles.error}>{error}</p>
      ) : null}
    </div>
  );
}
