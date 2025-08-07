# Web 应用 - 登录注册功能实现

## 🎯 功能概览

基于 gateway API 实现了完整的用户认证系统，包括：

### ✅ 已实现功能

1. **用户登录页面** (`/login`)
   - 用户名/邮箱 + 密码登录
   - 密码可见性切换
   - 记住我选项
   - 表单验证
   - 错误提示

2. **用户注册页面** (`/register`)
   - 用户名、邮箱、密码注册
   - 邮箱验证码发送和验证
   - 密码强度验证
   - 确认密码验证
   - 发送验证码倒计时

3. **忘记密码页面** (`/forgot-password`)
   - 邮箱重置密码链接发送

4. **认证状态管理**
   - Zustand 全局状态管理
   - 自动获取当前用户信息
   - 登录状态持久化
   - 退出登录

5. **UI 组件**
   - 基于 shadcn/ui 组件库
   - 响应式设计
   - 现代化界面

## 🏗️ 技术架构

### 前端技术栈

- **React 19** - UI 框架
- **TanStack Router** - 路由管理
- **Zustand** - 状态管理
- **shadcn/ui** - UI 组件库
- **Tailwind CSS 4** - 样式框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 状态管理

```typescript
// 认证状态 store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  sendVerificationCode: (email) => Promise<response>;
}
```

### 表单处理

- 自定义 `useForm` hook
- 内置验证规则
- 实时错误提示
- 类型安全

## 📁 文件结构

```
apps/web/src/
├── components/
│   ├── ui/              # shadcn/ui 组件
│   ├── Header.tsx       # 导航栏组件
│   └── ProtectedRoute.tsx  # 路由保护组件
├── hooks/
│   └── useForm.ts       # 表单处理 hook
├── stores/
│   └── auth.ts          # 认证状态管理
├── routes/
│   ├── __root.tsx       # 根路由
│   ├── index.tsx        # 首页
│   ├── login.tsx        # 登录页
│   ├── register.tsx     # 注册页
│   └── forgot-password.tsx  # 忘记密码页
└── lib/
    └── utils.ts         # 工具函数
```

## 🔗 API 集成

### 登录流程

```typescript
// POST /api/auth/login
const login = async (credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 重要：包含 cookies
    body: JSON.stringify(credentials),
  });
  // Cookie 自动设置，无需手动处理 token
};
```

### 注册流程

```typescript
// 1. 发送验证码
// POST /api/auth/send-verification-code
const sendCode = await sendVerificationCode(email);

// 2. 注册用户
// POST /api/auth/register
const register = async (data) => {
  // 包含 emailVerificationCode
};
```

### 自动认证状态

```typescript
// GET /api/auth/me
const getCurrentUser = async () => {
  // 自动从 cookie 获取 token
  // 更新全局用户状态
};
```

## 🎨 UI 设计特点

### 组件设计

- **现代化卡片式布局**
- **图标 + 输入框组合**
- **渐变背景和阴影**
- **一致的间距和排版**

### 交互体验

- **实时表单验证**
- **加载状态显示**
- **错误和成功提示**
- **密码可见性切换**
- **验证码倒计时**

### 响应式设计

- **移动端友好**
- **自适应布局**
- **合理的断点**

## 🔐 安全特性

### 前端安全

- **XSS 防护** - React 内置
- **CSRF 防护** - Cookie SameSite
- **类型安全** - TypeScript
- **输入验证** - 客户端 + 服务端

### 认证安全

- **HttpOnly Cookies** - 防止 XSS 攻击
- **自动 token 刷新**
- **会话管理**

## 🚀 快速开始

### 启动开发环境

```bash
# 启动所有服务（gateway + server + web）
pnpm dev

# 或单独启动 web 应用
cd apps/web
pnpm dev
```

### 访问地址

- **Web 应用**: http://localhost:3001
- **Gateway API**: http://localhost:8080
- **Server API**: http://localhost:8090

### 测试账户

按照注册流程创建新账户进行测试。

## 📋 使用说明

### 注册流程

1. 访问 `/register` 注册页面
2. 填写用户名、邮箱
3. 点击"发送验证码"按钮
4. 检查邮箱获取6位验证码
5. 填写密码和确认密码
6. 点击注册完成账户创建

### 登录流程

1. 访问 `/login` 登录页面
2. 输入用户名/邮箱和密码
3. 可选择"记住我"
4. 点击登录进入系统

### 状态管理

- 登录成功后自动跳转到首页
- 用户信息显示在导航栏
- 支持退出登录
- 页面刷新后状态保持

## 🔄 与 Gateway API 的集成

完全基于 `AUTH_IMPLEMENTATION.md` 中定义的 API 接口：

- ✅ `/auth/login` - 用户登录
- ✅ `/auth/register` - 用户注册
- ✅ `/auth/send-verification-code` - 发送验证码
- ✅ `/auth/me` - 获取当前用户
- ✅ `/auth/logout` - 退出登录
- ✅ `/auth/forgot-password` - 忘记密码

所有 API 调用都包含 `credentials: 'include'` 以正确处理 Cookie 认证。

## 📝 待扩展功能

1. **密码重置页面** - 处理重置密码邮件链接
2. **个人资料页面** - 用户信息编辑
3. **密码修改页面** - 修改当前密码
4. **第三方登录** - OAuth2 集成
5. **双因素认证** - 2FA 支持

---

🎉 **现在你已经拥有了一个完整的、现代化的认证系统前端！**
