import { authStore } from "@/stores/auth";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
  // 由于我们在 main.tsx 中已经初始化了用户状态，这里可以简化
  loader: async () => {
    // 确保用户状态已经初始化，如果还没有则等待初始化完成
    const state = authStore.getState();
    if (!state.isInitialized && !state.isLoading) {
      try {
        await state.initialLoader();
      } catch (error) {
        // 用户未登录是正常情况
        console.log("User not authenticated in root loader");
      }
    }
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
