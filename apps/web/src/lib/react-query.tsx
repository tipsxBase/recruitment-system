import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

/**
 * React Query 客户端配置
 *
 * 配置说明：
 * - defaultOptions: 设置默认的查询和变更选项
 * - queries.staleTime: 数据过期时间，5分钟后数据被视为过期
 * - queries.retry: 失败重试次数，默认3次
 * - queries.refetchOnWindowFocus: 窗口重新获得焦点时是否重新获取数据
 * - mutations.retry: 变更操作失败时的重试次数，默认不重试
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存时间，5分钟内不会重新请求
      staleTime: 5 * 60 * 1000,
      // 失败重试次数
      retry: 3,
      // 窗口重新获得焦点时不自动重新获取数据
      refetchOnWindowFocus: false,
      // 组件挂载时是否重新获取数据
      refetchOnMount: true,
      // 网络重新连接时是否重新获取数据
      refetchOnReconnect: true,
    },
    mutations: {
      // 变更操作失败时不重试
      retry: false,
    },
  },
});

/**
 * React Query Provider 组件
 *
 * 用于包装应用程序并提供 React Query 功能
 *
 * @param children - 子组件
 */
interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境下显示 React Query 开发工具 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
