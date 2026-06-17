import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { parseTrackedPostIds, TRACKED_POST_IDS_COOKIE } from "@/shared/lib/tracked-posts";
import { readPost } from "./posts";

async function getTrackedPostIds() {
  const cookieStore = await cookies();
  const trackedIdsValue = cookieStore.get(TRACKED_POST_IDS_COOKIE)?.value;

  return parseTrackedPostIds(trackedIdsValue);
}

export async function getPosts() {
  const trackedPostIds = await getTrackedPostIds();
  const posts = [];

  for (const postId of trackedPostIds) {
    const result = await readPost(postId);

    if (result.result) {
      posts.push(result.data);
    }
  }

  return posts;
}

export async function getPost(id) {
  const trackedPostIds = await getTrackedPostIds();
  const numericId = Number(id);

  if (!trackedPostIds.includes(numericId)) {
    notFound();
  }

  const result = await readPost(id);

  if (!result.result) {
    if (result.status === 404) {
      notFound();
    }

    throw new Error("Unable to load post.");
  }

  return result.data;
}