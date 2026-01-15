// AI Generated slop vanilla JS for the network debugger panel.
// I'm not using React here because I want to be able
// to view clean React Performance Tracks without
// the debugger being part of the trace.

function clamp(x) {
  return Math.max(0, Math.min(1, x));
}

// Call: const off = onPathChange(({ from, to }) => { ... });
function onPathChange(cb) {
  let prevPath = location.pathname;

  if ("navigation" in window) {
    // Post-commit signal; fires after the URL actually changes.
    const handler = (e) => {
      const to = new URL(navigation.currentEntry?.url ?? location.href);
      if (to.pathname !== prevPath) {
        const old = prevPath;
        prevPath = to.pathname;
        cb({ from: old, to: to.pathname, type: e?.navigationType });
      }
    };
    navigation.addEventListener("currententrychange", handler);
    return () => navigation.removeEventListener("currententrychange", handler);
  }

  // Fallback: popstate/hash + patch push/replace
  const fireIfChanged = () => {
    const next = location.pathname;
    if (next !== prevPath) {
      const old = prevPath;
      prevPath = next;
      cb({ from: old, to: next });
    }
  };

  const onPop = () => fireIfChanged();
  const onHash = () => fireIfChanged();
  window.addEventListener("popstate", onPop);
  window.addEventListener("hashchange", onHash);

  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function () {
    const ret = origPush.apply(this, arguments);
    fireIfChanged();
    return ret;
  };
  history.replaceState = function () {
    const ret = origReplace.apply(this, arguments);
    fireIfChanged();
    return ret;
  };

  return () => {
    window.removeEventListener("popstate", onPop);
    window.removeEventListener("hashchange", onHash);
    history.pushState = origPush;
    history.replaceState = origReplace;
  };
}

function TimedProgress({ startMs, delayMs, onDone, height = "6px" }) {
  const container = document.createElement("div");
  container.setAttribute("role", "progressbar");
  container.setAttribute("aria-valuemin", "0");
  container.setAttribute("aria-valuemax", "100");
  container.setAttribute("aria-label", "Timed progress");
  Object.assign(container.style, {
    position: "relative",
    width: "100%",
    height,
    background: "rgba(53,143,127,0.08)",
    borderRadius: height,
    overflow: "hidden",
  });

  const bar = document.createElement("div");
  Object.assign(bar.style, {
    position: "absolute",
    inset: 0,
    transform: "translateX(-100%)",
    width: "100%",
    willChange: "transform",
    background: "#00bc7d",
  });
  container.appendChild(bar);

  let raf = 0;
  let doneFired = false;

  function tick() {
    const now = Date.now();
    const progress = clamp((now - startMs) / delayMs);
    bar.style.transform = `translateX(${progress * 100 - 100}%)`;

    if (progress < 1) {
      raf = requestAnimationFrame(tick);
    } else if (!doneFired) {
      doneFired = true;
      if (onDone) onDone();
    }
  }
  raf = requestAnimationFrame(tick);

  container._cleanup = () => cancelAnimationFrame(raf);
  return container;
}

function NetworkRequest({ label, id, api, row, onDelayChange }) {
  let requestsDiv;
  if (!row) {
    row = document.createElement("div");
    row.className = "network-row";
    const header = document.createElement("div");
    header.className = "network-row-header";
    const labelDiv = document.createElement("div");
    labelDiv.textContent = label;
    const controls = document.createElement("div");
    controls.className = "network-controls";
    const span = document.createElement("span");
    span.textContent = api.delay + "ms";
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "3000";
    input.step = "50";
    input.value = api.delay;
    input.addEventListener("input", (e) => {
      const value = Number(e.target.value);
      span.textContent = value + "ms";
      onDelayChange(id, value);
    });
    controls.appendChild(span);
    controls.appendChild(input);
    header.appendChild(labelDiv);
    header.appendChild(controls);
    requestsDiv = document.createElement("div");
    requestsDiv.className = "network-row-requests";
    row.appendChild(header);
  } else {
    const controls = row.querySelector(".network-controls");
    const span = controls.querySelector("span");
    const input = controls.querySelector("input");
    span.textContent = api.delay + "ms";
    input.value = api.delay;
    requestsDiv = row.querySelector(".network-row-requests");
    requestsDiv.innerHTML = "";
  }

  const requests = api.requests || [];
  const activeRequests = requests.filter((req) => !req.done);
  if (activeRequests.length === 0) {
    const empty = document.createElement("div");
    empty.className = "network-request min-h-6";
    requestsDiv.appendChild(empty);
  } else {
    activeRequests.forEach((req) => {
      const reqDiv = document.createElement("div");
      reqDiv.className = "network-request";
      const span = document.createElement("span");
      span.textContent = req.label;
      reqDiv.appendChild(span);
      reqDiv.appendChild(
        TimedProgress({ startMs: req.start, delayMs: req.delay }),
      );
      requestsDiv.appendChild(reqDiv);
    });
  }

  row.appendChild(requestsDiv);

  return row;
}

// Debugger: main container
function Debugger() {
  const container = document.createElement("div");
  container.className = "debugger";

  let delays = {
    "/lessons": 0,
    "/lesson/:id/toggle": 0,
    "/login": 0,
  };

  let rows = {};

  // Fetch initial delays from server
  fetch("/api/debug")
    .then((res) => res.json())
    .then((data) => {
      delays = data;
      render();
    })
    .catch(() => {
      // Use defaults if fetch fails
      render();
    });

  function setDelay(path, value) {
    delays[path] = value;
    // Send to server
    fetch("/api/debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, value }),
    });
  }

  function render() {
    let apis;
    if (window.location.pathname === "/login") {
      apis = [
        { label: "GET /lessons", id: "/lessons" },
        { label: "POST /login", id: "/login" },
      ];
    } else {
      apis = [
        { label: "GET /lessons", id: "/lessons" },
        { label: "POST /lessons/:id", id: "/lesson/:id/toggle" },
      ];
    }
    apis.forEach(({ label, id }) => {
      const api = { delay: delays[id] || 0, requests: [] };
      if (!rows[id]) {
        rows[id] = NetworkRequest({
          label,
          id,
          api,
          onDelayChange: setDelay,
        });
        container.appendChild(rows[id]);
      } else {
        NetworkRequest({
          label,
          id,
          api,
          row: rows[id],
          onDelayChange: setDelay,
        });
      }
    });
  }

  onPathChange(() => {
    rows = {};
    container.innerHTML = "";
    render();
  });

  return container;
}

// Initialize debugger when DOM is ready
function initDebugger() {
  const root = document.getElementById("debugger");
  if (root && !root.hasChildNodes()) {
    root.appendChild(Debugger());
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDebugger);
} else {
  initDebugger();
}
