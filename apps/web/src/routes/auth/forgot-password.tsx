import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("密码重置邮件已发送，请检查您的邮箱。");
      } else {
        setMessage("发送失败，请重试。");
      }
    } catch (error) {
      setMessage("发生错误，请稍后再试。");
    }
  };

  return (
    <div className="forgot-password">
      <h1>忘记密码</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">邮箱地址：</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">发送重置邮件</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
