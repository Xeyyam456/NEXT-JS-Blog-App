"use client";

import { createPost, updatePost } from "@/services/posts";
import { useTrackedPosts } from "@/shared/hooks";
import { notifyError, notifySuccess } from "@/shared/lib/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useSavePost({ mode, postId }) {
  const router = useRouter();
  const { trackPost } = useTrackedPosts();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  async function savePost(formData) {
    setError("");
    setIsSubmitting(true);

    try {
      const result = isEditMode
        ? await updatePost(postId, formData)
        : await createPost(formData);

      if (!result.result) {
        throw new Error(result.data?.message || "Unable to save the post.");
      }

      const savedPost = result.data;

      if (!isEditMode) {
        trackPost(savedPost.id);
      }

      notifySuccess(
        isEditMode ? "Post updated" : "Post published",
        isEditMode ? "Post updated successfully." : "Post published successfully."
      );

      router.push("/");
      router.refresh();
      return result;
    } catch (requestError) {
      const message = requestError.message || "Unable to save the post.";

      setError(message);
      notifyError("Request failed", message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    error,
    isEditMode,
    isSubmitting,
    savePost,
  };
}