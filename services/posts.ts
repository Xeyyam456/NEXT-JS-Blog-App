import http from "./http";
import { successHandler, errorHandler } from "./request-handlers";
import type { ApiResult, PostId } from "@/types/api";
import type { Post, PostFormData } from "@/types/post";

function normalizePost(post: Post): Post {
  if (!post || typeof post !== "object") {
    return post;
  }

  return { ...post, displayId: post.id };
}

export async function readPost(id: PostId): Promise<ApiResult<Post>> {
  try {
    const response = await http.get<Post>(`/${id}`);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function createPost(payload: PostFormData): Promise<ApiResult<Post>> {
  try {
    const response = await http.post<Post>("", payload);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function updatePost(id: PostId, payload: PostFormData): Promise<ApiResult<Post>> {
  try {
    const response = await http.put<Post>(`/${id}`, payload);
    const result = successHandler(response);

    result.data = normalizePost(result.data);

    return result;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function deletePost(id: PostId): Promise<ApiResult<null>> {
  try {
    const response = await http.delete<null>(`/${id}`);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
}
