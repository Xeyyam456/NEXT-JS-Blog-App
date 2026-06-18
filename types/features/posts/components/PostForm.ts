import type { Post, PostFormMode } from "@/types/post";

export type PostFormProps = {
  mode: PostFormMode;
  post?: Post;
};
