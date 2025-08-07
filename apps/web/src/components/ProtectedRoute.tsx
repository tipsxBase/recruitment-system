import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, getCurrentUser, isLoading } = useAuthStore();

  useEffect(() => {
    // 尝试获取当前用户信息
    if (!isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser]);

  useEffect(() => {
    // 如果加载完成且未认证，重定向到登录页
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/login" });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 将重定向到登录页
  }

  return <>{children}</>;
}
