import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { redirectIfAuthenticated } from "@/lib/auth-guards";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("无效的重置链接");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("两次输入的密码不一致");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("密码已成功重置");
      } else {
        setMessage("重置失败，请重试");
      }
    } catch (error) {
      setMessage("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password max-w-md mx-auto mt-10">
      <Card className="p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">重置密码</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          请设置您的新密码。
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              新密码：
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="请输入新密码"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              确认新密码：
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="请再次输入新密码"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <span className="loader mr-2" /> : null}重置密码
          </Button>
        </form>
        {message && <Alert className="mt-4">{message}</Alert>}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/(auth)/reset-password")({
  component: ResetPassword,
  beforeLoad: async () => {
    // 检查用户是否已经登录，如果已登录则重定向到首页
    await redirectIfAuthenticated();
  },
});
