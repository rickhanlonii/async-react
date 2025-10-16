import * as fakeServer from "./fake-data.js";

let debuggingState = {
  "/lessons": {
    delay: localStorage.getItem("/lessons") || 0,
    requests: [],
  },
  "/lesson/:id/toggle": {
    delay: localStorage.getItem("/lesson/:id/toggle") || 0,
    requests: [],
  },
  "/login": {
    delay: localStorage.getItem("/login") || 0,
    requests: [],
  },
};

let requestId = 0;

export function getRequestConfig(url) {
  const pathname = getPathPattern(url);
  const state = debuggingState[pathname];
  return { path: pathname, delay: state.delay };
}

function notifyDebugging() {
  debuggingState = { ...debuggingState };
  window.dispatchEvent(
    new CustomEvent("debugging-update", { detail: debuggingState }),
  );
}

const HOST = `http://localhost:8080`;

let clientOrServerFetch = globalThis.fetch;

function parseUrl(url) {
  const u = new URL(url, "http://localhost");
  const segments = u.pathname.split("/").filter(Boolean);
  const endpoint = segments[segments.length - 1];
  const params = {};

  // If the path is like /lesson/123/toggle, extract id
  if (
    segments.length > 2 &&
    (/\d+/.test(segments[segments.length - 2]) ||
      /^[0-9a-fA-F-]{6,}$/.test(segments[segments.length - 2]))
  ) {
    params.id = segments[segments.length - 2];
  }

  // Parse query params
  u.searchParams.forEach((value, key) => {
    if (key === "q") params.search = value;
    else params[key] = value;
  });

  return { endpoint, params: Object.keys(params).length ? params : undefined };
}

if (import.meta.env.VITE_USE_REAL_SERVER !== "true") {
  clientOrServerFetch = (url) => {
    const { endpoint, params } = parseUrl(url);
    if (endpoint === "lessons") {
      return fakeServer
        .getLessons(params?.tab, params?.search, params?.delay)
        .then((data) => {
          return { json: () => Promise.resolve(data) };
        });
    } else if (endpoint === "toggle" && params?.id) {
      return fakeServer
        .postLessonToggle(params.id, params?.delay)
        .then((data) => {
          return { json: () => Promise.resolve(data) };
        });
    } else if (endpoint === "login") {
      return fakeServer.postLogin(params?.delay).then((data) => {
        return { json: () => Promise.resolve(data) };
      });
    } else {
      return Promise.reject(new Error("Unknown endpoint"));
    }
  };
}

export function delayedFetch(url, options) {
  const { delay, path } = getRequestConfig(url);
  const request = addRequest(path, {
    id: requestId,
    label: `${options?.method || "GET"} ${url}`,
    start: Date.now(),
    done: false,
    delay: delay,
    resolve: null,
  });

  const delayedUrl = new URL(url, HOST);
  delayedUrl.searchParams.set("delay", String(delay));

  return clientOrServerFetch(delayedUrl, options)
    .then((response) => {
      markRequestDone(request);
      return response.json();
    })
    .catch((e) => {
      markRequestDone(request);
      throw e;
    });
}

function addRequest(type, request) {
  debuggingState[type].requests.push(request);
  notifyDebugging();
  return request;
}

function markRequestDone(request) {
  if (request) {
    request.done = true;
    notifyDebugging();
  }
}

function getPathPattern(url) {
  const { pathname } = new URL(url, HOST);
  return pathname
    .split("/")
    .map((segment) => {
      if (!segment) return "";
      // match numeric IDs or UUID-like strings
      if (/^\d+$/.test(segment) || /^[0-9a-fA-F-]{6,}$/.test(segment)) {
        return ":id";
      }
      return segment;
    })
    .join("/");
}

window.addEventListener("debugging-set-delay", ({ detail }) => {
  const { id, value } = detail;
  debuggingState[id].delay = value;
  localStorage.setItem(id, value);
  notifyDebugging();
});
