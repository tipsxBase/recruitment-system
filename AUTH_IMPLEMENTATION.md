## 📋 概述

我们已经成功实现了基于邮箱验证码的注册流程，并移除了原有的激活机制。新流程更加简洁高效，用户体验更好。

## 🚀 新认证流程

### 1. 注册流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端
    participant G as Gateway
    participant E as 邮件服务
    participant D as 数据库

    U->>F: 输入邮箱
    F->>G: POST /auth/send-verification-code
    G->>E: 发送验证码邮件
    E-->>U: 邮件(验证码)
    G-->>F: {success: true, expiresIn: 600}

    U->>F: 填写注册信息+验证码
    F->>G: POST /auth/register
    G->>G: 验证邮箱验证码
    G->>D: 创建用户(emailVerified: true)
    G-->>F: {id, username, email, emailVerified: true}
```

### 2. 登录流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant F as 前端
    participant G as Gateway
    participant D as 数据库

    U->>F: 输入用户名/密码
    F->>G: POST /auth/login
    G->>D: 验证用户凭据
    G->>G: 生成JWT token
    G->>F: Set-Cookie: access_token, refresh_token
    G-->>F: {user, expiresIn}
    F->>F: 后续请求自动携带cookie
```

## 🛠️ API 接口文档

### 发送邮箱验证码

**接口:** `POST /api/auth/send-verification-code`

**请求体:**

```json
{
  "email": "user@example.com"
}
```

**响应:**

```json
{
  "success": true,
  "message": "验证码已发送，请检查您的邮箱",
  "expiresIn": 600
}
```

**限制:**

- 同一邮箱1分钟内最多发送1次
- 验证码有效期10分钟
- 最多尝试验证5次

### 用户注册

**接口:** `POST /api/auth/register`

**请求体:**

```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "Password123!",
  "emailVerificationCode": "123456"
}
```

**响应:**

```json
{
  "id": "uuid",
  "username": "testuser",
  "email": "user@example.com",
  "emailVerified": true,
  "message": "注册成功！"
}
```

### 用户登录

**接口:** `POST /api/auth/login`

**请求体:**

```json
{
  "username": "testuser",
  "password": "Password123!",
  "rememberMe": false
}
```

**响应:**

```json
{
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "user@example.com",
    "emailVerified": true,
    "roles": [...],
    "permissions": [...]
  },
  "expiresIn": 3600
}
```

**Cookie 设置:**

- `access_token`: JWT 访问令牌 (1小时)
- `refresh_token`: 刷新令牌 (7天)

### 获取当前用户

**接口:** `GET /api/auth/me`

**需要认证:** ✅ (Cookie 或 Bearer Token)

**响应:**

```json
{
  "id": "uuid",
  "username": "testuser",
  "email": "user@example.com",
  "emailVerified": true,
  "department": {...},
  "roles": [...],
  "permissions": [...]
}
```

### 刷新令牌

**接口:** `POST /api/auth/refresh`

**说明:** 自动从 Cookie 获取 refresh_token，无需请求体

**响应:**

```json
{
  "expiresIn": 3600
}
```

### 退出登录

**接口:** `POST /api/auth/logout`

**需要认证:** ✅

**响应:**

```json
{
  "message": "退出登录成功"
}
```

**效果:** 清除所有认证相关的 Cookie

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# JWT 配置
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1h

# 邮件服务配置
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=your-email@qq.com
SMTP_PASS=your-app-password
SMTP_FROM="招聘系统" <your-email@qq.com>

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/recruitment

# 服务配置
GATEWAY_PORT=8080
SERVER_BASE_URL=http://localhost:8090

# CORS 配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🎯 前端集成示例

### React/Vue 集成

```javascript
// 1. 发送验证码
const sendVerificationCode = async (email) => {
  const response = await fetch("/api/auth/send-verification-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  return response.json();
};

// 2. 用户注册
const register = async (userData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 3. 用户登录
const login = async (credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// 4. 获取当前用户
const getCurrentUser = async () => {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });
  return response.json();
};

// 5. 退出登录
const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};
```

### 请求拦截器配置

```javascript
// Axios 示例
axios.defaults.withCredentials = true;

// Fetch 示例
const apiCall = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
  });
};
```

## 🔐 安全特性

### 验证码安全

- ✅ 6位数字验证码
- ✅ 10分钟有效期
- ✅ 最多5次验证尝试
- ✅ 1分钟内限制发送频率
- ✅ 自动清理过期验证码

### Cookie 安全

- ✅ HttpOnly: 防止 XSS 攻击
- ✅ Secure: 生产环境仅 HTTPS
- ✅ SameSite=Strict: 防止 CSRF 攻击
- ✅ 自动过期时间控制

### 密码安全

- ✅ bcrypt 加密存储
- ✅ 强密码策略验证
- ✅ 密码长度和复杂度要求

### 输入验证

- ✅ Zod schema 验证
- ✅ 用户名格式检查
- ✅ 邮箱格式验证
- ✅ SQL 注入防护

## 🧪 测试示例

### 使用 curl 测试

```bash
# 1. 发送验证码
curl -X POST http://localhost:8080/api/auth/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. 注册用户
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Password123!",
    "emailVerificationCode":"123456"
  }'

# 3. 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"testuser","password":"Password123!"}'

# 4. 获取当前用户
curl -X GET http://localhost:8080/api/auth/me \
  -b cookies.txt

# 5. 退出登录
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt
```

## 📊 改进点总结

### ✅ 已完成

1. **简化注册流程**: 移除二次激活，验证码验证即激活
2. **Cookie 认证**: 自动处理 token，前端无需手动管理
3. **安全增强**: 多层安全防护和限制策略
4. **错误处理**: 完善的错误信息和状态反馈
5. **类型安全**: 完整的 TypeScript 类型定义

### 🚀 未来优化

1. **Redis 缓存**: 生产环境使用 Redis 存储验证码
2. **短信验证**: 可选的手机验证码注册方式
3. **第三方登录**: OAuth2 社交账号登录
4. **二次验证**: 敏感操作的 2FA 认证
5. **设备管理**: 多设备登录状态管理

---

现在你的认证系统已经完全重构完成！🎉 用户注册体验更加流畅，安全性得到了全面提升。
