"use client";

import { deletePost } from "@/features/posts/services/posts";
import { notifyError, notifyInfo, notifySuccess } from "@/shared/lib/notifications";
import { Modal } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./DeletePostButton.module.css";

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    try {
      const result = await deletePost(postId);

      if (!result.ok) {
        throw result.error;
      }

      setIsModalOpen(false);
      notifySuccess("Post deleted", result.message);
      router.push("/");
      router.refresh();
    } catch (requestError) {
      const message = requestError.message || "Unable to delete the post.";

      setError(message);
      notifyError("Delete failed", message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={styles.root}>
      <button
        type="button"
        onClick={openModal}
        className="danger-button"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Story"}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (isDeleting) {
            return;
          }

          closeModal();
          notifyInfo("Delete cancelled", "The post was kept unchanged.");
        }}
        title="Delete this story?"
        description="This action permanently removes the post from the live API and cannot be undone."
        footer={(
          <>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                closeModal();
                notifyInfo("Delete cancelled", "The post was kept unchanged.");
              }}
              disabled={isDeleting}
            >
              Keep Story
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </>
        )}
      />

      {error ? <p className={`feedback error-text ${styles.error}`}>{error}</p> : null}
    </div>
  );
}