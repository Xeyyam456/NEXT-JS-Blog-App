export const TRACKED_POST_IDS_COOKIE = "pulse-owned-post-ids";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function normalizePostId(postId) {
  const numericId = Number(postId);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

function uniquePostIds(postIds) {
  return [...new Set(postIds)];
}

export function parseTrackedPostIds(rawValue) {
  if (!rawValue) {
    return [];
  }

  return uniquePostIds(
    rawValue
      .split(",")
      .map((value) => normalizePostId(value.trim()))
      .filter((postId) => postId !== null)
  );
}

export function addTrackedPostId(postIds, postId) {
  const normalizedId = normalizePostId(postId);

  if (normalizedId === null) {
    return uniquePostIds(postIds);
  }

  return uniquePostIds([...postIds, normalizedId]);
}

export function removeTrackedPostId(postIds, postId) {
  const normalizedId = normalizePostId(postId);

  if (normalizedId === null) {
    return uniquePostIds(postIds);
  }

  return uniquePostIds(postIds).filter((currentId) => currentId !== normalizedId);
}

export function serializeTrackedPostIds(postIds) {
  return uniquePostIds(postIds)
    .map((postId) => normalizePostId(postId))
    .filter((postId) => postId !== null)
    .join(",");
}

function readBrowserCookie(name) {
  if (typeof document === "undefined") {
    return "";
  }

  const cookiePrefix = `${name}=`;
  const cookieEntry = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(cookiePrefix));

  if (!cookieEntry) {
    return "";
  }

  return decodeURIComponent(cookieEntry.slice(cookiePrefix.length));
}

function writeBrowserCookie(name, value) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function clearBrowserCookie(name) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function readTrackedPostIdsFromBrowser() {
  return parseTrackedPostIds(readBrowserCookie(TRACKED_POST_IDS_COOKIE));
}

export function trackPostInBrowser(postId) {
  const nextIds = addTrackedPostId(readTrackedPostIdsFromBrowser(), postId);
  const serializedIds = serializeTrackedPostIds(nextIds);

  if (!serializedIds) {
    clearBrowserCookie(TRACKED_POST_IDS_COOKIE);
    return;
  }

  writeBrowserCookie(TRACKED_POST_IDS_COOKIE, serializedIds);
}

export function untrackPostInBrowser(postId) {
  const nextIds = removeTrackedPostId(readTrackedPostIdsFromBrowser(), postId);
  const serializedIds = serializeTrackedPostIds(nextIds);

  if (!serializedIds) {
    clearBrowserCookie(TRACKED_POST_IDS_COOKIE);
    return;
  }

  writeBrowserCookie(TRACKED_POST_IDS_COOKIE, serializedIds);
}