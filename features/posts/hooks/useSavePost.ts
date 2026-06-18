"use client";

import { createPost, updatePost } from "@/services/posts";
import { useTrackedPosts } from "@/shared/hooks";
import { notifyError, notifySuccess } from "@/shared/lib/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PostFormData } from "@/types/post";
import type { UseSavePostParams, UseSavePostReturn } from "@/types/features/posts/hooks/useSavePost";

export default function useSavePost(params: UseSavePostParams): UseSavePostReturn {
  const router = useRouter();
  const { trackPost } = useTrackedPosts();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = params.mode === "edit";

  async function savePost(formData: PostFormData) {
    setError("");
    setIsSubmitting(true);

    try {
      const result = params.mode === "edit"
        ? await updatePost(params.postId, formData)
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
      const message = requestError instanceof Error ? requestError.message : "Unable to save the post.";

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
