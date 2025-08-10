import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { authStore } from "@/stores/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (authStore.getState().isAuthenticated) {
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
