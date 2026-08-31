import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Edition layout: each work type is a child route under this edition. */
export const Route = createFileRoute("/$locale/fos")({
  component: FosLayout,
});

function FosLayout() {
  return <Outlet />;
}
