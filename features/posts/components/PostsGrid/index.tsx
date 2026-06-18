"use client";

import PostCard from "../PostCard";
import { usePostSearch } from "@/features/posts/hooks";
import { EmptyState } from "@/shared/ui";
import styles from "./PostsGrid.module.css";
import type { PostsGridProps } from "@/types/features/posts/components/PostsGrid";

export default function PostsGrid({ posts }: PostsGridProps) {
  const { searchTerm, setSearchTerm, filteredPosts } = usePostSearch(posts);

  return (
    <>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title..."
        className={styles.search}
        aria-label="Search posts by title"
      />

      <p className={styles.resultCount}>
        {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"} found
      </p>

      {filteredPosts.length === 0 ? (
        <EmptyState
          kicker="No matches"
          title="No posts match your search"
          description="Try a different title, or clear the search to see your full archive."
        />
      ) : (
        <div className={styles.postGrid}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
