import { delayedFetch } from "./debug.jsx";

// With suspense-enabled data fetching.
// These use a cache for suspense-enabled data fetching.
let lessonsCache = new Map();

export function revalidate() {
  lessonsCache = new Map();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function prefetchLessons() {
  const promise = delayedFetch(`/lessons?tab=all&q=`);
  lessonsCache.set("all", promise);
  return Promise.race([promise, delay(1000)]);
}

export function getLessons(tab, search) {
  const key = tab + search;
  if (lessonsCache.has(key)) {
    return lessonsCache.get(key);
  }

  const promise = delayedFetch(
    `/lessons?tab=${tab || "all"}&q=${search || ""}`,
  );
  lessonsCache.set(key, promise);
  return promise;
}

export async function mutateToggle(id) {
  return delayedFetch(`/lesson/${id}/toggle`, {
    method: "POST",
  }).then(() => {
    revalidate();
  });
}

export async function login() {
  return delayedFetch("/login", {
    method: "POST",
  }).then(() => {
    revalidate();
  });
}
