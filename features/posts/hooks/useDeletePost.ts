"use client";

import { deletePost } from "@/services/posts";
import { useTrackedPosts } from "@/shared/hooks";
import { notifyError, notifySuccess } from "@/shared/lib/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PostId } from "@/types/api";
import type { UseDeletePostReturn } from "@/types/features/posts/hooks/useDeletePost";

export default function useDeletePost(postId: PostId): UseDeletePostReturn {
  const router = useRouter();
  const { untrackPost } = useTrackedPosts();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    try {
      const result = await deletePost(postId);

      if (!result.result) {
        throw new Error(result.data?.message || "Unable to delete the post.");
      }

      untrackPost(postId);
      notifySuccess("Post deleted", "Post deleted successfully.");
      router.push("/");
      router.refresh();
      return result;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to delete the post.";

      setError(message);
      notifyError("Delete failed", message);
      return null;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    error,
    isDeleting,
    handleDelete,
  };
}
