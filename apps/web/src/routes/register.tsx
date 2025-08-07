import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Eye, EyeOff, Lock, User, Mail, Hash } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailVerificationCode: string;
}

function RegisterPage() {
  const router = useRouter();
  const { register, sendVerificationCode, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<RegisterFormData>(
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      emailVerificationCode: "",
    },
    {
      username: validation.username,
      email: validation.email,
      password: validation.password,
      confirmPassword: (value, allValues) =>
        validation.confirmPassword(value, allValues?.password || ""),
      emailVerificationCode: validation.verificationCode,
    }
  );

  const handleSendCode = async () => {
    const emailError = validation.email(form.values.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setError("");
      const result = await sendVerificationCode(form.values.email);
      setSuccess(result.message);
      setCodeSent(true);

      // 倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送验证码失败");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setError("");
      await register({
        username: data.username,
        email: data.email,
        password: data.password,
        emailVerificationCode: data.emailVerificationCode,
      });
      setSuccess("注册成功！请前往登录页面登录");
      setTimeout(() => {
        router.navigate({ to: "/login" });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败，请重试");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
          <CardDescription>注册新账户开始使用</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  className="pl-10"
                  {...form.getFieldProps("username")}
                />
              </div>
              {form.errors.username && form.touched.username && (
                <p className="text-sm text-red-500">{form.errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  className="pl-10"
                  {...form.getFieldProps("email")}
                />
              </div>
              {form.errors.email && form.touched.email && (
                <p className="text-sm text-red-500">{form.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailVerificationCode">邮箱验证码</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="emailVerificationCode"
                    type="text"
                    placeholder="请输入6位验证码"
                    className="pl-10"
                    maxLength={6}
                    {...form.getFieldProps("emailVerificationCode")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || !form.values.email}
                  className="px-4 whitespace-nowrap"
                >
                  {countdown > 0
                    ? `${countdown}s`
                    : codeSent
                      ? "重新发送"
                      : "发送验证码"}
                </Button>
              </div>
              {form.errors.emailVerificationCode &&
                form.touched.emailVerificationCode && (
                  <p className="text-sm text-red-500">
                    {form.errors.emailVerificationCode}
                  </p>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="请再次输入密码"
                  className="pl-10 pr-10"
                  {...form.getFieldProps("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.errors.confirmPassword && form.touched.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                已有账户？
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
