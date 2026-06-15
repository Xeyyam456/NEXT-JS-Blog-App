"use client";

import { deletePost } from "@/services/posts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this post permanently?");

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await deletePost(postId);
      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete the post.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="delete-action">
      <button
        type="button"
        onClick={handleDelete}
        className="danger-button"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Story"}
      </button>
      {error ? <p className="feedback error-text">{error}</p> : null}
    </div>
  );
}