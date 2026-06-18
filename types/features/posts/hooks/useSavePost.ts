import type { ApiResult, PostId } from "@/types/api";
import type { Post, PostFormData } from "@/types/post";

export type UseSavePostParams =
  | { mode: "edit"; postId: PostId }
  | { mode: "create"; postId?: PostId };

export type UseSavePostReturn = {
  error: string;
  isEditMode: boolean;
  isSubmitting: boolean;
  savePost: (formData: PostFormData) => Promise<ApiResult<Post> | null>;
};
