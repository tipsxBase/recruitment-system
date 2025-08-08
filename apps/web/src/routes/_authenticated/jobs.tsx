import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/jobs"!</div>;
}
