import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Edition layout: each work type is a child route under this edition. */
export const Route = createFileRoute("/$locale/android")({
  component: AndroidLayout,
});

function AndroidLayout() {
  return <Outlet />;
}
