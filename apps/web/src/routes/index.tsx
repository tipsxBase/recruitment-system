import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {isAuthenticated && user ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                欢迎来到招聘系统
              </h1>
              <p className="text-xl text-gray-600">
                欢迎回来，{user.username}！
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>职位管理</CardTitle>
                  <CardDescription>查看和管理招聘职位</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">查看职位</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>候选人管理</CardTitle>
                  <CardDescription>管理求职者信息和简历</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">查看候选人</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>面试安排</CardTitle>
                  <CardDescription>安排和管理面试流程</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">查看面试</Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">用户信息</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>用户名:</strong> {user.username}
                  </p>
                  <p>
                    <strong>邮箱:</strong> {user.email}
                  </p>
                  <p>
                    <strong>状态:</strong> {user.status}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>部门:</strong> {user.department?.name || "未分配"}
                  </p>
                  <p>
                    <strong>角色:</strong>{" "}
                    {user.roles.map((r) => r.name).join(", ") || "无"}
                  </p>
                  <p>
                    <strong>邮箱验证:</strong>{" "}
                    {user.emailVerified ? "已验证" : "未验证"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
              <img
                src={logo}
                className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
                alt="logo"
              />
              <h1 className="text-4xl font-bold mb-4">招聘管理系统</h1>
              <p className="text-xl mb-8">专业的人才招聘管理平台</p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <a href="/login">立即登录</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/register">免费注册</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
