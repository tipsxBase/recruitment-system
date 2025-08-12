# Profile 接口权限增强说明

## 概述

已成功增强 `/api/auth/profile` 接口，现在用户信息响应中包含分离的菜单权限和按钮权限，方便前端统一管理权限控制。

## 接口响应格式

### 新增字段

```json
{
  "success": true,
  "code": 200,
  "message": "success",
  "data": {
    "id": "user-super-admin",
    "username": "superadmin",
    "email": "superadmin@system.local",
    // ... 其他用户字段

    // 权限相关字段
    "permissions": [...],           // 所有权限代码（兼容旧版本）
    "menuPermissions": [...],       // 菜单权限代码（新增）
    "buttonPermissions": [...]      // 按钮权限代码（新增）
  }
}
```

### 权限字段说明

1. **permissions** - 所有权限代码列表（包含菜单和按钮权限）
   - 用于兼容旧版本代码
   - 包含完整的权限信息

2. **menuPermissions** - 菜单权限代码列表
   - 只包含菜单类型的权限
   - 用于构建导航菜单

3. **buttonPermissions** - 按钮权限代码列表
   - 只包含按钮类型的权限
   - 用于控制页面按钮显示

## 前端使用示例

### React 权限管理组件

```tsx
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  permissions: string[];
  menuPermissions: string[];
  buttonPermissions: string[];
  // ... 其他字段
}

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  hasMenuPermission: (menuCode: string) => boolean;
  hasButtonPermission: (buttonCode: string) => boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户信息
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 权限检查函数
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasMenuPermission = (menuCode: string): boolean => {
    return user?.menuPermissions?.includes(menuCode) || false;
  };

  const hasButtonPermission = (buttonCode: string): boolean => {
    return user?.buttonPermissions?.includes(buttonCode) || false;
  };

  const login = async (credentials: any) => {
    // 登录逻辑
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const result = await response.json();
    if (result.success) {
      setUser(result.data.user);
    }
  };

  const logout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hasPermission,
        hasMenuPermission,
        hasButtonPermission,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### 权限控制组件

```tsx
// components/PermissionWrapper.tsx
import React from "react";
import { useAuth } from "../hooks/useAuth";

interface PermissionWrapperProps {
  children: React.ReactNode;
  permission?: string; // 通用权限检查
  menuPermission?: string; // 菜单权限检查
  buttonPermission?: string; // 按钮权限检查
  fallback?: React.ReactNode; // 无权限时显示的内容
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  permission,
  menuPermission,
  buttonPermission,
  fallback = null,
}) => {
  const { hasPermission, hasMenuPermission, hasButtonPermission } = useAuth();

  // 权限检查逻辑
  let hasAccess = true;

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (menuPermission && !hasMenuPermission(menuPermission)) {
    hasAccess = false;
  }

  if (buttonPermission && !hasButtonPermission(buttonPermission)) {
    hasAccess = false;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// 便捷的按钮权限组件
export const PermissionButton: React.FC<{
  permission: string;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ permission, children, ...props }) => {
  return (
    <PermissionWrapper buttonPermission={permission}>
      <button {...props}>{children}</button>
    </PermissionWrapper>
  );
};
```

### 导航菜单组件

```tsx
// components/NavigationMenu.tsx
import React from "react";
import { useAuth } from "../hooks/useAuth";

interface MenuItem {
  code: string;
  name: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    code: "DASHBOARD",
    name: "首页",
    path: "/",
    icon: "home",
  },
  {
    code: "SYSTEM",
    name: "系统管理",
    icon: "settings",
    children: [
      { code: "USER_MANAGE", name: "用户管理", path: "/system/users" },
      { code: "DEPT_MANAGE", name: "部门管理", path: "/system/departments" },
      { code: "ROLE_MANAGE", name: "角色管理", path: "/system/roles" },
    ],
  },
  {
    code: "RECRUITMENT",
    name: "招聘管理",
    icon: "users",
    children: [
      { code: "POST_MANAGE", name: "岗位管理", path: "/recruitment/posts" },
      {
        code: "CANDIDATE_MANAGE",
        name: "候选人管理",
        path: "/recruitment/candidates",
      },
      {
        code: "INTERVIEW_MANAGE",
        name: "面试管理",
        path: "/recruitment/interviews",
      },
    ],
  },
];

export const NavigationMenu: React.FC = () => {
  const { hasMenuPermission } = useAuth();

  const renderMenuItem = (item: MenuItem) => {
    // 检查菜单权限
    if (!hasMenuPermission(item.code)) {
      return null;
    }

    return (
      <div key={item.code} className="menu-item">
        <div className="menu-title">
          {item.icon && <i className={`icon-${item.icon}`} />}
          {item.name}
        </div>

        {item.children && (
          <div className="menu-children">
            {item.children.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  };

  return <nav className="navigation-menu">{menuItems.map(renderMenuItem)}</nav>;
};
```

### 页面按钮权限控制

```tsx
// pages/UserManagement.tsx
import React from "react";
import {
  PermissionWrapper,
  PermissionButton,
} from "../components/PermissionWrapper";

export const UserManagement: React.FC = () => {
  return (
    <div className="user-management">
      <div className="page-header">
        <h1>用户管理</h1>

        {/* 使用 PermissionButton 组件 */}
        <PermissionButton
          permission="USER_CREATE"
          className="btn btn-primary"
          onClick={() => console.log("新增用户")}
        >
          新增用户
        </PermissionButton>
      </div>

      <div className="user-list">
        {/* 用户列表 */}
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <span>{user.name}</span>

            <div className="actions">
              {/* 编辑按钮 */}
              <PermissionWrapper buttonPermission="USER_EDIT">
                <button
                  className="btn btn-secondary"
                  onClick={() => editUser(user.id)}
                >
                  编辑
                </button>
              </PermissionWrapper>

              {/* 删除按钮 */}
              <PermissionWrapper buttonPermission="USER_DELETE">
                <button
                  className="btn btn-danger"
                  onClick={() => deleteUser(user.id)}
                >
                  删除
                </button>
              </PermissionWrapper>

              {/* 重置密码按钮 */}
              <PermissionWrapper buttonPermission="USER_RESET_PASSWORD">
                <button
                  className="btn btn-warning"
                  onClick={() => resetPassword(user.id)}
                >
                  重置密码
                </button>
              </PermissionWrapper>
            </div>
          </div>
        ))}
      </div>

      {/* 批量操作按钮 */}
      <div className="batch-actions">
        <PermissionWrapper buttonPermission="USER_IMPORT">
          <button className="btn btn-info">批量导入</button>
        </PermissionWrapper>

        <PermissionWrapper buttonPermission="USER_EXPORT">
          <button className="btn btn-info">批量导出</button>
        </PermissionWrapper>
      </div>
    </div>
  );
};
```

## 权限代码对照表

### 菜单权限 (menuPermissions)

| 权限代码           | 名称       | 描述                   |
| ------------------ | ---------- | ---------------------- |
| `DASHBOARD`        | 首页       | 系统主页访问权限       |
| `SYSTEM`           | 系统管理   | 系统管理模块访问权限   |
| `USER_MANAGE`      | 用户管理   | 用户管理页面访问权限   |
| `DEPT_MANAGE`      | 部门管理   | 部门管理页面访问权限   |
| `ROLE_MANAGE`      | 角色管理   | 角色管理页面访问权限   |
| `ORG_MANAGE`       | 组织管理   | 组织管理页面访问权限   |
| `RECRUITMENT`      | 招聘管理   | 招聘管理模块访问权限   |
| `POST_MANAGE`      | 岗位管理   | 岗位管理页面访问权限   |
| `CANDIDATE_MANAGE` | 候选人管理 | 候选人管理页面访问权限 |
| `INTERVIEW_MANAGE` | 面试管理   | 面试管理页面访问权限   |
| `ANALYTICS`        | 统计分析   | 统计分析页面访问权限   |
| `TODO_MANAGE`      | 我的待办   | 待办事项页面访问权限   |

### 按钮权限 (buttonPermissions)

| 权限代码                 | 名称     | 描述                 |
| ------------------------ | -------- | -------------------- |
| `USER_CREATE`            | 新增用户 | 创建用户按钮权限     |
| `USER_EDIT`              | 编辑用户 | 编辑用户按钮权限     |
| `USER_DELETE`            | 删除用户 | 删除用户按钮权限     |
| `USER_RESET_PASSWORD`    | 重置密码 | 重置密码按钮权限     |
| `USER_IMPORT`            | 导入用户 | 批量导入用户按钮权限 |
| `USER_EXPORT`            | 导出用户 | 批量导出用户按钮权限 |
| `DEPT_CREATE`            | 新增部门 | 创建部门按钮权限     |
| `DEPT_EDIT`              | 编辑部门 | 编辑部门按钮权限     |
| `DEPT_DELETE`            | 删除部门 | 删除部门按钮权限     |
| `ROLE_CREATE`            | 新增角色 | 创建角色按钮权限     |
| `ROLE_EDIT`              | 编辑角色 | 编辑角色按钮权限     |
| `ROLE_DELETE`            | 删除角色 | 删除角色按钮权限     |
| `ROLE_ASSIGN_PERMISSION` | 分配权限 | 角色权限分配按钮权限 |
| ...                      | ...      | 其他按钮权限         |

## 优势

1. **统一权限管理** - 通过 profile 接口一次性获取所有权限信息
2. **减少接口调用** - 无需单独调用菜单和权限接口
3. **分离关注点** - 菜单权限和按钮权限明确分离
4. **向后兼容** - 保留原有 permissions 字段，确保兼容性
5. **前端友好** - 便于构建权限控制组件和导航菜单

## 注意事项

1. 权限信息会在用户登录和获取 profile 时更新
2. 如果用户权限发生变更，需要重新获取 profile 信息
3. 建议在应用中缓存权限信息，避免频繁请求
4. 前端权限控制只是用户体验优化，服务端仍需进行权限验证
