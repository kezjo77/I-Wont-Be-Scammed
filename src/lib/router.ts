import { useEffect, useState } from "react";

export type Route = "home" | "learn" | "report" | "patterns";

const ROUTES: Route[] = ["home", "learn", "report", "patterns"];

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  return (ROUTES.includes(raw as Route) ? raw : "home") as Route;
}

export function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r === "home" ? "/" : `/${r}`;
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return [route, navigate];
}
