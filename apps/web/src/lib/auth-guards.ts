import { redirect } from "@tanstack/react-router";
import globalStore from "@/stores/global";

/**
 * 认证路由守卫 - 阻止已登录用户访问认证页面（如登录、注册页面）
 * 如果用户已登录，重定向到指定页面或首页
 */
export const redirectIfAuthenticated = (redirectTo: string = "/") => {
  const { isAuthenticated } = globalStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: redirectTo });
  }
};

/**
 * 保护路由守卫 - 要求用户必须登录才能访问
 * 如果用户未登录，重定向到登录页面
 */
export const requireAuthentication = (redirectTo: string = "/login") => {
  const { isAuthenticated } = globalStore.getState();
  if (!isAuthenticated) {
    throw redirect({
      to: redirectTo,
      search: {
        // 可以添加重定向回原页面的逻辑
        redirect: window.location.pathname,
      },
    });
  }
};
