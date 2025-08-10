import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import globalStore from "@/stores/global";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (globalStore.getState().isAuthenticated) {
      return;
    }
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  },
  component: AuthenticatedLayout,
});
