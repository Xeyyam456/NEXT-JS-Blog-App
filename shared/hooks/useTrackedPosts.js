"use client";

import {
  addTrackedPostId,
  readTrackedPostIdsFromBrowser,
  removeTrackedPostId,
  trackPostInBrowser,
  untrackPostInBrowser,
} from "@/shared/lib/tracked-posts";
import { useState } from "react";

export default function useTrackedPosts() {
  const [trackedPostIds, setTrackedPostIds] = useState(() => readTrackedPostIdsFromBrowser());

  function trackPost(postId) {
    trackPostInBrowser(postId);
    setTrackedPostIds((currentIds) => addTrackedPostId(currentIds, postId));
  }

  function untrackPost(postId) {
    untrackPostInBrowser(postId);
    setTrackedPostIds((currentIds) => removeTrackedPostId(currentIds, postId));
  }

  function isTracked(postId) {
    return trackedPostIds.includes(Number(postId));
  }

  return {
    trackedPostIds,
    trackPost,
    untrackPost,
    isTracked,
  };
}