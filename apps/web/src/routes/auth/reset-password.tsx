import React, { useState } from "react";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("无效的重置链接");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("两次输入的密码不一致");
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
      setMessage("发生错误，请稍后再试");
    }
  };

  return (
    <div className="reset-password">
      <h1>重置密码</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">新密码：</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">确认新密码：</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">重置密码</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
