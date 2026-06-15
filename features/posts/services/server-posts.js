import { notFound } from "next/navigation";
import { listPosts, readPost } from "./posts";

export async function getPosts() {
  return listPosts();
}

export async function getPost(id) {
  try {
    const post = await readPost(id);

    if (!post) {
      notFound();
    }

    return post;
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }

    throw error;
  }
}