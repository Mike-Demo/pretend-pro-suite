import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Edition layout: each work type is a child route under this edition. */
export const Route = createFileRoute("/$locale/bufferium")({
  component: BufferiumLayout,
});

function BufferiumLayout() {
  return <Outlet />;
}
