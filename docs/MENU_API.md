# 菜单权限 API 文档

## 概述

本文档描述了获取用户菜单权限的 API 接口，这些接口基于 seed 脚本初始化的权限体系构建。

## 认证

所有菜单权限接口都需要 JWT 认证，请在请求头中包含有效的 JWT token 或通过 cookie 传递。

### 登录获取 Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "superadmin@system"
}
```

## 接口列表

### 1. 获取用户菜单

**接口地址：** `GET /api/menu/user-menus`

**描述：** 获取当前用户可访问的菜单树结构

**请求参数：** 无（从 JWT token 中获取用户信息）

**响应示例：**

```json
{
  "success": true,
  "code": 200,
  "message": "获取菜单成功",
  "data": [
    {
      "id": "perm-dashboard",
      "name": "首页",
      "code": "DASHBOARD",
      "type": "MENU",
      "sort": 0,
      "hidden": false
    },
    {
      "id": "perm-system",
      "name": "系统管理",
      "code": "SYSTEM",
      "type": "MENU",
      "sort": 0,
      "hidden": false,
      "children": [
        {
          "id": "perm-user-manage",
          "name": "用户管理",
          "code": "USER_MANAGE",
          "type": "MENU",
          "sort": 0,
          "hidden": false,
          "parentId": "perm-system"
        },
        {
          "id": "perm-dept-manage",
          "name": "部门管理",
          "code": "DEPT_MANAGE",
          "type": "MENU",
          "sort": 0,
          "hidden": false,
          "parentId": "perm-system"
        }
      ]
    }
  ]
}
```

### 2. 获取用户按钮权限

**接口地址：** `GET /api/menu/user-permissions`

**描述：** 获取当前用户可使用的按钮权限代码列表

**请求参数：** 无（从 JWT token 中获取用户信息）

**响应示例：**

```json
{
  "success": true,
  "code": 200,
  "message": "获取权限成功",
  "data": [
    "USER_CREATE",
    "USER_EDIT",
    "USER_DELETE",
    "USER_RESET_PASSWORD",
    "DEPT_CREATE",
    "DEPT_EDIT",
    "DEPT_DELETE",
    "ROLE_CREATE",
    "ROLE_EDIT",
    "ROLE_DELETE"
  ]
}
```

## 菜单结构说明

基于 seed 脚本初始化的菜单结构包含以下主要模块：

### 一级菜单

1. **首页** (`DASHBOARD`) - 系统主页
2. **系统管理** (`SYSTEM`) - 系统设置和管理
3. **招聘管理** (`RECRUITMENT`) - 招聘业务模块
4. **统计分析** (`ANALYTICS`) - 数据分析
5. **我的待办** (`TODO_MANAGE`) - 个人任务管理

### 系统管理子菜单

- **用户管理** (`USER_MANAGE`) - 用户账号管理
- **部门管理** (`DEPT_MANAGE`) - 组织架构管理
- **角色管理** (`ROLE_MANAGE`) - 角色权限配置
- **组织管理** (`ORG_MANAGE`) - 多租户组织管理

### 招聘管理子菜单

- **岗位管理** (`POST_MANAGE`) - 职位发布和管理
- **候选人管理** (`CANDIDATE_MANAGE`) - 应聘者信息管理
- **面试管理** (`INTERVIEW_MANAGE`) - 面试安排和反馈

## 权限代码说明

### 用户管理权限

- `USER_CREATE` - 新增用户
- `USER_EDIT` - 编辑用户
- `USER_DELETE` - 删除用户
- `USER_RESET_PASSWORD` - 重置密码
- `USER_IMPORT` - 导入用户
- `USER_EXPORT` - 导出用户

### 部门管理权限

- `DEPT_CREATE` - 新增部门
- `DEPT_EDIT` - 编辑部门
- `DEPT_DELETE` - 删除部门

### 角色管理权限

- `ROLE_CREATE` - 新增角色
- `ROLE_EDIT` - 编辑角色
- `ROLE_DELETE` - 删除角色
- `ROLE_ASSIGN_PERMISSION` - 分配权限

### 招聘管理权限

- `POST_CREATE` - 新增岗位
- `CANDIDATE_CREATE` - 新增候选人
- `INTERVIEW_CREATE` - 创建面试
- `ASSESSMENT_ASSIGN` - 分配评估
- `ASSESSMENT_EXECUTE` - 执行评估
- `ASSESSMENT_CONFIRM` - 确认评估

## 角色权限分配

根据 seed 脚本，系统包含以下预定义角色：

### 1. 超级管理员 (`SUPER_ADMIN`)

- 拥有所有权限
- 用于系统初始化和紧急管理

### 2. 组织管理员 (`ORG_ADMIN`)

- 组织内的完整管理权限
- 不能创建/删除组织

### 3. HR专员 (`HR`)

- 招聘流程管理
- 候选人管理
- 面试安排

### 4. 部门负责人 (`DEPARTMENT_LEADER`)

- 部门候选人评估
- 面试安排
- 待办事项管理

### 5. 面试官 (`INTERVIEWER`)

- 执行面试
- 提交面试反馈
- 候选人评估

## 使用示例

### JavaScript/TypeScript

```typescript
// 获取用户菜单
async function getUserMenus() {
  const response = await fetch("/api/menu/user-menus", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // JWT token 通过 cookie 自动发送
    },
    credentials: "include",
  });

  const result = await response.json();
  if (result.success) {
    return result.data; // 菜单树数组
  } else {
    throw new Error(result.message);
  }
}

// 获取用户权限
async function getUserPermissions() {
  const response = await fetch("/api/menu/user-permissions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  if (result.success) {
    return result.data; // 权限代码数组
  } else {
    throw new Error(result.message);
  }
}

// 检查是否有特定权限
function hasPermission(permissions: string[], permissionCode: string): boolean {
  return permissions.includes(permissionCode);
}
```

### React 使用示例

```tsx
import React, { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  code: string;
  type: "MENU" | "BUTTON";
  sort: number;
  hidden: boolean;
  parentId?: string;
  children?: MenuItem[];
}

const MenuComponent: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    // 获取菜单和权限
    Promise.all([getUserMenus(), getUserPermissions()]).then(
      ([menuData, permissionData]) => {
        setMenus(menuData);
        setPermissions(permissionData);
      }
    );
  }, []);

  const renderMenu = (menuItems: MenuItem[]) => {
    return menuItems.map((item) => (
      <div key={item.id}>
        <span>{item.name}</span>
        {item.children && renderMenu(item.children)}
      </div>
    ));
  };

  return (
    <div>
      <h3>用户菜单</h3>
      {renderMenu(menus)}

      <h3>用户权限</h3>
      <div>
        {permissions.includes("USER_CREATE") && <button>新增用户</button>}
        {permissions.includes("USER_EDIT") && <button>编辑用户</button>}
      </div>
    </div>
  );
};
```

## 错误处理

### 常见错误码

- `401` - 未授权，需要登录
- `403` - 禁止访问，权限不足
- `500` - 服务器内部错误

### 错误响应格式

```json
{
  "success": false,
  "code": 401,
  "message": "未授权访问"
}
```

## 注意事项

1. **安全性**：所有接口都需要有效的 JWT 认证
2. **权限控制**：菜单和权限基于用户的角色动态生成
3. **多租户**：权限系统支持多组织架构
4. **缓存**：建议在客户端缓存菜单和权限数据，减少重复请求
5. **实时性**：用户权限变更后，建议重新获取最新的菜单和权限信息
