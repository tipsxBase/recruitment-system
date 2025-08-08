import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/interviews")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/interviews"!</div>;
}
