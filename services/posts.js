import http from "./http";
import { successHandler, errorHandler } from "./request-handlers";

function normalizePost(post) {
  if (!post || typeof post !== "object") {
    return post;
  }

  return { ...post, displayId: post.id };
}

export async function readPost(id) {
  try {
    const response = await http.get(`/${id}`);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function createPost(payload) {
  try {
    const response = await http.post("", payload);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function updatePost(id, payload) {
  try {
    const response = await http.put(`/${id}`, payload);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function deletePost(id) {
  try {
    const response = await http.delete(`/${id}`);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
}