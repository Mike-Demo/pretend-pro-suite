import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Trailing-slash canonicals: the static host 308-redirects extensionless
    // paths (e.g. /us-en/fruit -> /us-en/fruit/), so generate trailing-slash
    // hrefs for internal links and normalize navigations to match.
    trailingSlash: "always",
    // Warm route code/data as soon as a link is hovered or focused.
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,

  });

  return router;
};
