import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import Header from "../components/Header";
import { useAuthStore } from "../stores/auth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    // 初始化时尝试获取当前用户信息
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
