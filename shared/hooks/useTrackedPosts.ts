"use client";

import {
  addTrackedPostId,
  readTrackedPostIdsFromBrowser,
  removeTrackedPostId,
  trackPostInBrowser,
  untrackPostInBrowser,
} from "@/shared/lib/tracked-posts";
import { useState } from "react";
import type { PostId } from "@/types/api";
import type { UseTrackedPostsReturn } from "@/types/shared/hooks/useTrackedPosts";

export default function useTrackedPosts(): UseTrackedPostsReturn {
  const [trackedPostIds, setTrackedPostIds] = useState(() => readTrackedPostIdsFromBrowser());

  function trackPost(postId: PostId) {
    trackPostInBrowser(postId);
    setTrackedPostIds((currentIds) => addTrackedPostId(currentIds, postId));
  }

  function untrackPost(postId: PostId) {
    untrackPostInBrowser(postId);
    setTrackedPostIds((currentIds) => removeTrackedPostId(currentIds, postId));
  }

  function isTracked(postId: PostId) {
    return trackedPostIds.includes(Number(postId));
  }

  return {
    trackedPostIds,
    trackPost,
    untrackPost,
    isTracked,
  };
}
