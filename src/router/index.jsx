import {
  useState,
  createContext,
  use,
  useLayoutEffect,
  useEffect,
  startTransition,
  addTransitionType,
} from "react";
import { revalidate } from "../data/index.js";

// There are two example routers here.
// One uses the Navigation API and the other uses window.history,
// because not all browsers support the Navigation API yet.

// In both cases the router works by updating state in a transition,
// then calling the pendingNav callback in a useLayoutEffect after the DOM has updated.
// This lets React update the DOM in a transition before committing the navigation.

// For the Navigation API router we intercept navigations and
// call event.intercept to tell the browser we will handle it.
// We call the pendingNav callback in the intercept handler
// to tell the browser to commit the navigation after React has updated the DOM.
// This allows the browser to wait to reset focus/scroll until after the transition is done.
function NavigationRouter({ children }) {
  const [routerState, setRouterState] = useState(() => ({
    pendingNav: () => {},
    url: document.location.pathname,
    search: parseSearchParams(document.location.search),
  }));

  function navigate(url) {
    window.navigation.navigate(url);
  }

  function setParams(key, value) {
    const newParams = parseSearchParams(document.location.search);
    if (value !== "") {
      newParams[key] = value;
    } else {
      delete newParams[key];
    }
    const newUrlParams = new URLSearchParams(newParams).toString();

    window.navigation.navigate(
      document.location.pathname + (newUrlParams ? `?${newUrlParams}` : ""),
    );
  }

  function refresh() {
    revalidate();
    startTransition(() => {
      setRouterState((prev) => {
        return {
          ...prev,
        };
      });
    });
  }

  useEffect(() => {
    function handleNavigate(event) {
      if (!event.canIntercept) {
        return;
      }
      const navigationType = event.navigationType;
      const previousIndex = window.navigation.currentEntry.index;
      const currURL = new URL(location.href);
      const newURL = new URL(event.destination.url);

      // If only the search params or hash are changing we want to
      // avoid the default focus reset that would happen.
      // The app can always reset focus manually if needed.
      const onlyParamsOrHash =
        newURL.pathname === currURL.pathname &&
        (newURL.search !== currURL.search || newURL.hash !== currURL.hash);

      event.intercept({
        handler() {
          let promise;
          startTransition(() => {
            addTransitionType("navigation-" + navigationType);
            if (navigationType === "traverse") {
              // For traverse types it's useful to distinguish going back or forward.
              const nextIndex = event.destination.index;
              if (nextIndex > previousIndex) {
                addTransitionType("navigation-forward");
              } else if (nextIndex < previousIndex) {
                addTransitionType("navigation-back");
              }
            }
            promise = new Promise((resolve) => {
              setRouterState({
                url: newURL.pathname,
                search: parseSearchParams(newURL.search),
                pendingNav: resolve,
              });
            });
          });
          return promise;
        },
        focusReset: onlyParamsOrHash ? "manual" : "after-transition",
      });
    }

    window.navigation.addEventListener("navigate", handleNavigate);
    return () => {
      window.navigation.removeEventListener("navigate", handleNavigate);
    };
  }, []);

  const pendingNav = routerState.pendingNav;

  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        search: routerState.search,
        navigate,
        setParams,
        refresh,
        isPending: false,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

// For the History API, we just call history.pushState in the pendingNav callback.
// This means the URL in the address bar only updates after React has updated the DOM.
// This isn't ideal, but it's the best we can do without the Navigation API.
// We also listen to 'popstate' events to handle back/forward navigations.
function HistoryRouter({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
    search: parseSearchParams(document.location.search),
  });

  function navigate(url) {
    startTransition(() => {
      setRouterState(() => {
        return {
          url,
          search: {},
          pendingNav() {
            window.history.pushState({}, "", url);
          },
        };
      });
    });
  }

  function setParams(key, value) {
    startTransition(() => {
      setRouterState((prev) => {
        const newParams = { ...prev.search };
        if (value !== "") {
          newParams[key] = value;
        } else {
          delete newParams[key];
        }
        return {
          url: prev.url,
          search: newParams,
          pendingNav() {
            const newUrlParams = new URLSearchParams(newParams).toString();
            window.history.pushState(
              {},
              "",
              prev.url + (newUrlParams ? `?${newUrlParams}` : ""),
            );
          },
        };
      });
    });
  }

  function refresh() {
    revalidate();
    startTransition(() => {
      setRouterState((prev) => {
        return {
          ...prev,
        };
      });
    });
  }

  useEffect(() => {
    function handlePopState() {
      // We still popstate in a transition, but React will flush this synchronously.
      // This ensures that browser 'back' navigations are instant, but if the data
      // layer has a cache miss, it will force fallbacks to be shown. This is a good
      // example why just clearing the cache when a component unmounts is a bad idea.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname,
          search: parseSearchParams(document.location.search),
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const pendingNav = routerState.pendingNav;

  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        search: routerState.search,
        navigate,
        setParams,
        refresh,
      }}
    >
      {children}
    </RouterContext>
  );
}

let SelectedRouter = HistoryRouter;
if (typeof navigation === "object") {
  SelectedRouter = NavigationRouter;
}

export const Router = SelectedRouter;

const RouterContext = createContext({
  url: "/",
  search: {},
  navigate: () => {},
  setParams: () => {},
  refresh: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
// TODO: fix this - not sure why I can't export a hook with this rule.
export function useRouter() {
  return use(RouterContext);
}

function parseSearchParams(queryString) {
  const params = new URLSearchParams(
    queryString.startsWith("?") ? queryString : `?${queryString}`,
  );
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}
