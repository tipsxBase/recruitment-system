import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useForm, validation } from "@/hooks/useForm";
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<LoginFormData>(
    {
      username: "",
      password: "",
      rememberMe: false,
    },
    {
      username: validation.usernameOrEmail,
      password: (value) => {
        if (!value) return "密码不能为空";
        return null;
      },
    }
  );

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError("");
      await login(data);
      router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请重试");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
          <CardDescription>登录您的账户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名或邮箱</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名或邮箱"
                  className="pl-10"
                  {...form.getFieldProps("username")}
                />
              </div>
              {form.errors.username && form.touched.username && (
                <p className="text-sm text-red-500">{form.errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  className="pl-10 pr-10"
                  {...form.getFieldProps("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.errors.password && form.touched.password && (
                <p className="text-sm text-red-500">{form.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={form.values.rememberMe}
                  onCheckedChange={(checked) =>
                    form.setValue("rememberMe", checked === true)
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  记住我
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                忘记密码？
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                还没有账户？
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
