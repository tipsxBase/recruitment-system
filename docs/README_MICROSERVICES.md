# 招聘系统微服务架构

## 架构概述

本项目采用微服务架构，主要包含以下服务：

### 🏗️ 服务架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Web Frontend  │    │    Gateway      │    │     Server      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (NestJS)      │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8090    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │                 │    │                 │
                       │      Redis      │    │   PostgreSQL    │
                       │   (缓存/会话)    │    │    (主数据库)    │
                       │   Port: 6379    │    │   Port: 5432    │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
```

### 📋 服务职责

#### Gateway (API 网关)

- **端口**: 8080
- **职责**:
  - 用户认证和授权 (JWT)
  - 请求限流和防护
  - 路由转发到业务服务
  - CORS 和安全策略
  - API 统一入口

#### Server (业务服务)

- **端口**: 8090
- **职责**:
  - 核心业务逻辑
  - 数据库操作
  - 用户管理
  - 岗位管理
  - 候选人管理
  - 面试流程管理

#### Web (前端应用)

- **端口**: 3000
- **职责**:
  - 用户界面
  - 与 Gateway 交互
  - 状态管理
  - 路由管理

### 🔐 认证流程

1. **用户登录** → Gateway `/api/auth/login`
2. **Gateway** 验证用户信息 → 调用 Server `/auth/validate`
3. **Server** 返回用户信息 → Gateway 生成 JWT Token
4. **后续请求** 携带 JWT Token → Gateway 验证并转发到 Server
5. **Server** 通过请求头获取用户信息进行业务处理

### 🛡️ 安全策略

#### Gateway 层面

- JWT Token 验证
- 请求频率限制 (Rate Limiting)
- CORS 跨域控制
- Helmet 安全头设置
- 输入验证和过滤

#### Server 层面

- 基于角色的权限控制 (RBAC)
- 数据库查询权限验证
- 敏感操作日志记录
- SQL 注入防护 (Prisma ORM)

### 📊 权限体系

```
┌─────────────┐
│   admin     │  ← 系统管理员 (所有权限)
├─────────────┤
│     hr      │  ← HR (岗位管理、候选人管理)
├─────────────┤
│ interviewer │  ← 面试官 (面试管理)
├─────────────┤
│   manager   │  ← 部门经理 (部门数据查看)
├─────────────┤
│    user     │  ← 普通用户 (基础功能)
└─────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm
- Docker & Docker Compose
- PostgreSQL 15+

### 安装依赖

```bash
# 安装所有依赖
pnpm install:all

# 或分别安装
pnpm install
pnpm --filter @recruitment/gateway install
pnpm --filter @recruitment/server install
pnpm --filter @recruitment/web install
```

### 开发环境启动

#### 方式1: 本地开发 (推荐)

```bash
# 启动数据库
docker-compose up postgres redis -d

# 数据库迁移
pnpm prisma:migrate

# 启动所有服务
pnpm dev

# 或分别启动
pnpm gateway:dev  # 启动 Gateway
pnpm server:dev   # 启动 Server
pnpm web:dev      # 启动 Web
```

#### 方式2: Docker 容器

```bash
# 启动所有服务
pnpm docker:up

# 查看日志
pnpm docker:logs

# 停止服务
pnpm docker:down
```

### 环境配置

#### Gateway (.env)

```env
GATEWAY_PORT=8080
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
SERVER_BASE_URL=http://localhost:8090
ALLOWED_ORIGINS=http://localhost:3000
```

#### Server (.env)

```env
PORT=8090
DATABASE_URL=postgresql://user:password@localhost:5432/recruitment
REDIS_URL=redis://localhost:6379
```

#### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 📝 API 文档

### Gateway APIs

#### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/logout` - 退出登录

#### 代理接口

- `* /api/*` - 代理所有其他请求到 Server

### Server APIs

#### 用户管理

- `GET /users` - 获取用户列表 (admin)
- `GET /users/:id` - 获取用户详情
- `PUT /users/:id` - 更新用户信息
- `DELETE /users/:id` - 删除用户 (admin)

#### 岗位管理

- `GET /jobs` - 获取岗位列表
- `POST /jobs` - 创建岗位 (hr/admin)
- `PUT /jobs/:id` - 更新岗位 (hr/admin)
- `DELETE /jobs/:id` - 删除岗位 (admin)

## 🏗️ 项目结构

```
recruitment-system/
├── apps/
│   ├── gateway/           # API 网关服务
│   │   ├── src/
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── proxy/     # 代理模块
│   │   │   ├── health/    # 健康检查
│   │   │   └── main.ts    # 入口文件
│   │   └── package.json
│   ├── server/            # 业务逻辑服务
│   │   ├── src/
│   │   │   ├── auth/      # 认证验证
│   │   │   ├── user/      # 用户管理
│   │   │   ├── job/       # 岗位管理
│   │   │   ├── health/    # 健康检查
│   │   │   └── main.ts    # 入口文件
│   │   ├── prisma/        # 数据库schema
│   │   └── package.json
│   └── web/               # 前端应用
├── packages/
│   ├── schema/            # 共享数据模型
│   └── shared/            # 共享工具库
├── docker-compose.yml     # 容器编排
└── package.json          # 根配置
```

## 🔧 开发工具

### 数据库管理

```bash
# 生成 Prisma Client
pnpm prisma:generate

# 运行数据库迁移
pnpm prisma:migrate

# 打开 Prisma Studio
pnpm prisma:studio
```

### 健康检查

- Gateway: http://localhost:8080/health
- Server: http://localhost:8090/health

### 监控和日志

```bash
# 查看 Docker 日志
pnpm docker:logs

# 查看特定服务日志
docker-compose logs -f gateway
docker-compose logs -f server
```

## 🚀 部署

### 生产环境配置

1. **设置环境变量**
   - 生产数据库连接
   - 强密码和密钥
   - 正确的跨域设置

2. **构建镜像**

   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **启动服务**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 扩展建议

- 使用 Nginx 作为反向代理
- 添加日志聚合 (ELK Stack)
- 添加监控 (Prometheus + Grafana)
- 使用 Redis Cluster
- 数据库读写分离

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 提交 Pull Request

## 📄 许可证

MIT License
