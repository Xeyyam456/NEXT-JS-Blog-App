import type { Post } from "@/types/post";

export type UsePostSearchReturn = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredPosts: Post[];
};
