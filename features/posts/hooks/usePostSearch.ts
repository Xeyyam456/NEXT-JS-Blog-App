"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import type { Post } from "@/types/post";
import type { UsePostSearchReturn } from "@/types/features/posts/hooks/usePostSearch";

export default function usePostSearch(posts: Post[]): UsePostSearchReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredPosts = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return posts;
    }

    return posts.filter((post) => post.title.toLowerCase().includes(normalizedTerm));
  }, [posts, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredPosts,
  };
}
