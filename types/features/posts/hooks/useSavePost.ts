import type { ApiResult, PostId } from "@/types/api";
import type { Post, PostFormData, PostFormMode } from "@/types/post";

export type UseSavePostParams = {
  mode: PostFormMode;
  postId?: PostId;
};

export type UseSavePostReturn = {
  error: string;
  isEditMode: boolean;
  isSubmitting: boolean;
  savePost: (formData: PostFormData) => Promise<ApiResult<Post> | null>;
};
