import type { PostId } from "@/types/api";

export const TRACKED_POST_IDS_COOKIE = "pulse-owned-post-ids";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function normalizePostId(postId: PostId): number | null {
  const numericId = Number(postId);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

function uniquePostIds(postIds: number[]): number[] {
  const uniqueIds: number[] = [];

  for (const postId of postIds) {
    if (!uniqueIds.includes(postId)) {
      uniqueIds.push(postId);
    }
  }

  return uniqueIds;
}

export function parseTrackedPostIds(rawValue?: string): number[] {
  if (!rawValue) {
    return [];
  }

  const rawIds = rawValue.split(",");
  const validIds: number[] = [];

  for (const rawId of rawIds) {
    const postId = normalizePostId(rawId.trim());

    if (postId !== null) {
      validIds.push(postId);
    }
  }

  return uniquePostIds(validIds);
}

export function addTrackedPostId(postIds: number[], postId: PostId): number[] {
  const normalizedId = normalizePostId(postId);

  if (normalizedId === null) {
    return uniquePostIds(postIds);
  }

  return uniquePostIds([...postIds, normalizedId]);
}

export function removeTrackedPostId(postIds: number[], postId: PostId): number[] {
  const normalizedId = normalizePostId(postId);

  if (normalizedId === null) {
    return uniquePostIds(postIds);
  }

  return uniquePostIds(postIds).filter((currentId) => currentId !== normalizedId);
}

export function serializeTrackedPostIds(postIds: number[]): string {
  const validIds: number[] = [];

  for (const postId of uniquePostIds(postIds)) {
    const normalizedId = normalizePostId(postId);

    if (normalizedId !== null) {
      validIds.push(normalizedId);
    }
  }

  return validIds.join(",");
}

function readBrowserCookie(name: string): string {
  if (typeof document === "undefined") {
    return "";
  }

  const cookiePrefix = `${name}=`;
  const allCookies = document.cookie.split(";");
  let cookieEntry = "";

  for (const rawCookie of allCookies) {
    const trimmedCookie = rawCookie.trim();

    if (trimmedCookie.startsWith(cookiePrefix)) {
      cookieEntry = trimmedCookie;
      break;
    }
  }

  if (!cookieEntry) {
    return "";
  }

  return decodeURIComponent(cookieEntry.slice(cookiePrefix.length));
}

function writeBrowserCookie(name: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function clearBrowserCookie(name: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function readTrackedPostIdsFromBrowser(): number[] {
  return parseTrackedPostIds(readBrowserCookie(TRACKED_POST_IDS_COOKIE));
}

export function trackPostInBrowser(postId: PostId): void {
  const nextIds = addTrackedPostId(readTrackedPostIdsFromBrowser(), postId);
  const serializedIds = serializeTrackedPostIds(nextIds);

  if (!serializedIds) {
    clearBrowserCookie(TRACKED_POST_IDS_COOKIE);
    return;
  }

  writeBrowserCookie(TRACKED_POST_IDS_COOKIE, serializedIds);
}

export function untrackPostInBrowser(postId: PostId): void {
  const nextIds = removeTrackedPostId(readTrackedPostIdsFromBrowser(), postId);
  const serializedIds = serializeTrackedPostIds(nextIds);

  if (!serializedIds) {
    clearBrowserCookie(TRACKED_POST_IDS_COOKIE);
    return;
  }

  writeBrowserCookie(TRACKED_POST_IDS_COOKIE, serializedIds);
}
