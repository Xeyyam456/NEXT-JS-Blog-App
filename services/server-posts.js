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

  if (trackedPostIds.length === 0) {
    return [];
  }

  const posts = await Promise.all(
    trackedPostIds.map(async (postId) => {
      try {
        return await readPost(postId);
      } catch (error) {
        if (error.status === 404) {
          return null;
        }

        throw error;
      }
    })
  );

  return posts.filter((post) => post !== null);
}

export async function getPost(id) {
  const trackedPostIds = await getTrackedPostIds();
  const numericId = Number(id);

  if (!trackedPostIds.includes(numericId)) {
    notFound();
  }

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