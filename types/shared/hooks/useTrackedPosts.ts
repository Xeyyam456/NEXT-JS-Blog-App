import type { PostId } from "@/types/api";

export type UseTrackedPostsReturn = {
  trackedPostIds: number[];
  trackPost: (postId: PostId) => void;
  untrackPost: (postId: PostId) => void;
  isTracked: (postId: PostId) => boolean;
};
