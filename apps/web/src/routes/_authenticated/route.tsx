import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { authStore } from "@/stores/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const state = authStore.getState();

    // 如果正在加载中或状态未初始化，等待初始化完成
    if (state.isLoading || (!state.isAuthenticated && !state.user)) {
      try {
        await state.initialLoader();
      } catch (error) {
        // 如果初始化失败，说明用户未登录，跳转到登录页
        throw redirect({
          to: "/login",
          search: {
            redirect: location.href,
          },
        });
      }
    }

    // 重新获取最新状态
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (location.pathname === "/") {
      // 如果是根路径，重定向到默认页面
      throw redirect({
        to: state.defaultPath! || "/todos",
      });
    }
  },
  loader: async () => {
    await authStore.getState().getMenus();
  },
  shouldReload: false,
  component: AuthenticatedLayout,
});
