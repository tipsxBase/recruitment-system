import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import globalStore from "@/stores/global";

export const Route = createRootRoute({
  component: RootComponent,
  loader: async () => {
    globalStore.getState().initialLoader();
  },
  staleTime: Infinity, // 30秒内不会重新执行loader
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
