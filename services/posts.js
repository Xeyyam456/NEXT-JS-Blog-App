import http from "./http";
import { runRequest, unwrapRequest } from "./request-handlers";

const DISPLAY_ID_OFFSET = 0;

function normalizePost(post) {
  if (!post || typeof post !== "object") {
    return post;
  }

  const numericId = Number(post.id);

  return {
    ...post,
    displayId: Number.isFinite(numericId) ? numericId + DISPLAY_ID_OFFSET : post.id,
  };
}

export async function listPosts() {
  const result = await unwrapRequest({
    request: async () => {
      const { data } = await http.get("");
      return Array.isArray(data) ? data.map(normalizePost) : [];
    },
    successMessage: "Posts loaded successfully.",
    errorMessage: "Unable to fetch posts.",
  });

  return result.data;
}

export async function readPost(id) {
  const result = await unwrapRequest({
    request: async () => {
      const { data } = await http.get(`/${id}`);
      return normalizePost(data);
    },
    successMessage: `Post ${id} loaded successfully.`,
    errorMessage: `Unable to fetch post ${id}.`,
  });

  return result.data;
}

export async function createPost(payload) {
  return runRequest({
    request: async () => {
      const { data } = await http.post("", payload);
      return data;
    },
    successMessage: "Post published successfully.",
    errorMessage: "Unable to create the post.",
  });
}

export async function updatePost(id, payload) {
  return runRequest({
    request: async () => {
      const { data } = await http.put(`/${id}`, payload);
      return data;
    },
    successMessage: `Post ${id} updated successfully.`,
    errorMessage: `Unable to update post ${id}.`,
  });
}

export async function deletePost(id) {
  return runRequest({
    request: async () => {
      const { data } = await http.delete(`/${id}`);
      return data;
    },
    successMessage: `Post ${id} deleted successfully.`,
    errorMessage: `Unable to delete post ${id}.`,
  });
}