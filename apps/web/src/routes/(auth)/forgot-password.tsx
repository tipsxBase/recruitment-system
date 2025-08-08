import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { createFileRoute } from "@tanstack/react-router";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage(
          "密码重置邮件已发送，请检查您的邮箱（包括垃圾邮件文件夹）。"
        );
      } else {
        setMessage("发送失败，请确认邮箱地址是否正确。");
      }
    } catch (error) {
      setMessage("网络错误，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password max-w-md mx-auto mt-10">
      <Card className="p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          忘记密码 - 招聘系统
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          输入您的注册邮箱地址，我们将发送密码重置链接。
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              邮箱地址：
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="请输入您的邮箱"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <span className="loader mr-2" /> : null}发送重置邮件
          </Button>
        </form>
        {message && <Alert className="mt-4">{message}</Alert>}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPassword,
});
