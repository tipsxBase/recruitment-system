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
│   │   └── package.json
│   └── web/               # 前端应用
├── packages/
├── ├── database           # 共享数据库信息及数据库连接
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
