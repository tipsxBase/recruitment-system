import { authStore } from "@/stores/auth";
import { redirect } from "@tanstack/react-router";

/**
 * 异步认证路由守卫 - 阻止已登录用户访问认证页面（如登录、注册页面）
 * 如果用户已登录，重定向到指定页面或首页
 * 会等待用户状态初始化完成后再进行判断
 */
export const redirectIfAuthenticated = async (redirectTo: string = "/") => {
  const state = authStore.getState();

  // 如果正在加载中，等待加载完成
  if (state.isLoading) {
    try {
      await state.initialLoader();
    } catch (error) {
      // 如果初始化失败，说明用户未登录，允许访问
      return;
    }
  }

  // 重新获取最新状态
  const { isAuthenticated } = authStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: redirectTo });
  }
};

/**
 * 同步版本的认证路由守卫 - 用于已经确保状态初始化的场景
 */
export const redirectIfAuthenticatedSync = (redirectTo: string = "/") => {
  const { isAuthenticated } = authStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: redirectTo });
  }
};

/**
 * 异步保护路由守卫 - 要求用户必须登录才能访问
 * 如果用户未登录，重定向到登录页面
 * 会等待用户状态初始化完成后再进行判断
 */
export const requireAuthentication = async (redirectTo: string = "/login") => {
  const state = authStore.getState();

  // 如果正在加载中，等待加载完成
  if (state.isLoading) {
    try {
      await state.initialLoader();
    } catch (error) {
      // 如果初始化失败，说明用户未登录，跳转到登录页
      throw redirect({
        to: redirectTo,
        search: {
          redirect: window.location.pathname,
        },
      });
    }
  }

  // 重新获取最新状态
  const { isAuthenticated } = authStore.getState();
  if (!isAuthenticated) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

/**
 * 同步版本的保护路由守卫 - 用于已经确保状态初始化的场景
 */
export const requireAuthenticationSync = (redirectTo: string = "/login") => {
  const { isAuthenticated } = authStore.getState();
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
