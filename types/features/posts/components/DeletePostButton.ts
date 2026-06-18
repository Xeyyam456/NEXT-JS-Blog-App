import type { PostId } from "@/types/api";

export type DeletePostButtonProps = {
  postId: PostId;
  buttonLabel?: string;
  buttonSize?: "small" | "xsmall";
  showInlineError?: boolean;
};
