# 招聘系统 API 接口设计文档

## 1. 通用约定

### 1.1 请求格式

- **Content-Type**: `application/json`
- **Authorization**: `Bearer <token>`
- **请求路径**: `/api/v1/{module}/{action}`

### 1.2 响应格式

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}
```

### 1.3 分页参数

```typescript
interface PaginationParams {
  page?: number; // 页码，默认1
  pageSize?: number; // 页大小，默认10
  sortBy?: string; // 排序字段
  sortOrder?: "asc" | "desc"; // 排序方向
}
```

### 1.4 通用错误码

- 200: 成功
- 400: 请求参数错误
- 401: 未认证
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

---

## 2. 认证模块 (auth)

### 2.1 用户注册

**接口路径**: `POST /api/v1/auth/register`

**入参**:

```typescript
interface RegisterRequest {
  username: string; // 用户名
  password: string; // 密码
  email?: string; // 邮箱
  phone?: string; // 手机号
  employeeNo?: string; // 工号
}
```

**出参**:

```typescript
interface RegisterResponse {
  id: string;
  username: string;
  email?: string;
  emailVerified: boolean;
  status: "ACTIVE" | "DISABLED";
}
```

**业务逻辑**:

1. 验证用户名、邮箱、手机号、工号的唯一性
2. 密码加密存储（bcrypt）
3. 如果提供邮箱，发送激活邮件
4. 默认状态为DISABLED，需管理员审核
5. 记录操作日志

### 2.2 用户登录

**接口路径**: `POST /api/v1/auth/login`

**入参**:

```typescript
interface LoginRequest {
  username: string; // 用户名或邮箱
  password: string; // 密码
  rememberMe?: boolean; // 记住我
}
```

**出参**:

```typescript
interface LoginResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    emailVerified: boolean;
    status: "ACTIVE" | "DISABLED";
    department?: {
      id: string;
      name: string;
    };
    roles: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

**业务逻辑**:

1. 验证用户名/邮箱和密码
2. 检查用户状态是否为ACTIVE
3. 检查邮箱是否已激活（如果需要）
4. 生成JWT token和refresh token
5. 记录登录日志

### 2.3 邮箱激活

**接口路径**: `POST /api/v1/auth/activate`

**入参**:

```typescript
interface ActivateRequest {
  token: string; // 激活令牌
}
```

**出参**:

```typescript
interface ActivateResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 验证激活令牌有效性
2. 更新用户emailVerified为true
3. 记录操作日志

### 2.4 找回密码

**接口路径**: `POST /api/v1/auth/forgot-password`

**入参**:

```typescript
interface ForgotPasswordRequest {
  email: string; // 邮箱
}
```

**出参**:

```typescript
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 验证邮箱是否存在
2. 生成重置密码令牌
3. 发送重置密码邮件
4. 记录操作日志

### 2.5 重置密码

**接口路径**: `POST /api/v1/auth/reset-password`

**入参**:

```typescript
interface ResetPasswordRequest {
  token: string; // 重置令牌
  newPassword: string; // 新密码
}
```

**出参**:

```typescript
interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 验证重置令牌有效性
2. 加密新密码并更新
3. 删除或失效重置令牌
4. 记录操作日志

### 2.6 刷新令牌

**接口路径**: `POST /api/v1/auth/refresh`

**入参**:

```typescript
interface RefreshTokenRequest {
  refreshToken: string; // 刷新令牌
}
```

**出参**:

```typescript
interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

**业务逻辑**:

1. 验证refresh token有效性
2. 生成新的access token和refresh token
3. 返回新令牌

### 2.7 获取当前用户信息

**接口路径**: `GET /api/v1/auth/profile`

**权限要求**: 所有登录用户

**入参**: 无

**出参**:

```typescript
interface GetCurrentUserResponse {
  id: string;
  username: string;
  email?: string;
  emailVerified: boolean;
  employeeNo?: string;
  phone?: string;
  status: "ACTIVE" | "DISABLED";
  department?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
    };
  };
  roles: Array<{
    id: string;
    name: string;
    code: string;
    description?: string;
  }>;
  permissions: string[]; // 权限编码列表
  createdAt: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 从token中获取用户ID
2. 查询用户完整信息
3. 包含部门、角色、权限信息
4. 用于前端初始化用户状态
5. 记录查询日志

---

## 3. 用户管理模块 (users)

### 3.1 获取用户列表

**接口路径**: `GET /api/v1/users`

**权限要求**: 管理员

**入参**:

```typescript
interface GetUsersRequest extends PaginationParams {
  keyword?: string; // 搜索关键词
  status?: "ACTIVE" | "DISABLED";
  departmentId?: string;
  roleId?: string;
  isDeleted?: boolean;
}
```

**出参**:

```typescript
interface GetUsersResponse {
  users: Array<{
    id: string;
    username: string;
    email?: string;
    emailVerified: boolean;
    employeeNo?: string;
    phone?: string;
    status: "ACTIVE" | "DISABLED";
    department?: {
      id: string;
      name: string;
    };
    roles: Array<{
      id: string;
      name: string;
      code: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
```

**业务逻辑**:

1. 权限验证：仅管理员可访问
2. 支持关键词搜索（用户名、邮箱、手机号）
3. 支持按状态、部门、角色筛选
4. 支持分页排序
5. 记录查询日志

### 3.2 获取用户详情

**接口路径**: `GET /api/v1/users/{id}`

**权限要求**: 管理员或本人

**入参**: 无

**出参**:

```typescript
interface GetUserDetailResponse {
  id: string;
  username: string;
  email?: string;
  emailVerified: boolean;
  employeeNo?: string;
  phone?: string;
  status: "ACTIVE" | "DISABLED";
  department?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
    };
  };
  roles: Array<{
    id: string;
    name: string;
    code: string;
    description?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：管理员可查看所有用户，普通用户只能查看自己
2. 返回用户完整信息
3. 记录查询日志

### 3.3 创建用户

**接口路径**: `POST /api/v1/users`

**权限要求**: 管理员

**入参**:

```typescript
interface CreateUserRequest {
  username: string;
  password: string;
  email?: string;
  employeeNo?: string;
  phone?: string;
  departmentId?: string;
  roleIds?: string[];
  status?: "ACTIVE" | "DISABLED";
}
```

**出参**:

```typescript
interface CreateUserResponse {
  id: string;
  username: string;
  email?: string;
  status: "ACTIVE" | "DISABLED";
}
```

**业务逻辑**:

1. 权限验证：仅管理员可创建
2. 验证用户名、邮箱、手机号、工号的唯一性
3. 密码加密存储
4. 分配角色和部门
5. 记录操作日志

### 3.4 更新用户

**接口路径**: `PUT /api/v1/users/{id}`

**权限要求**: 管理员

**入参**:

```typescript
interface UpdateUserRequest {
  username?: string;
  email?: string;
  employeeNo?: string;
  phone?: string;
  departmentId?: string;
  roleIds?: string[];
  status?: "ACTIVE" | "DISABLED";
}
```

**出参**:

```typescript
interface UpdateUserResponse {
  id: string;
  username: string;
  email?: string;
  status: "ACTIVE" | "DISABLED";
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可更新
2. 验证更新字段的唯一性
3. 更新用户信息
4. 同步更新角色关联
5. 记录操作日志

### 3.5 批量导入用户

**接口路径**: `POST /api/v1/users/batch-import`

**权限要求**: 管理员

**入参**:

```typescript
interface BatchImportUsersRequest {
  users: Array<{
    username: string;
    password: string;
    email?: string;
    employeeNo?: string;
    phone?: string;
    departmentId?: string;
    roleIds?: string[];
  }>;
}
```

**出参**:

```typescript
interface BatchImportUsersResponse {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    username: string;
    error: string;
  }>;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可导入
2. 批量验证用户数据
3. 逐条创建用户，记录成功/失败
4. 返回导入结果统计
5. 记录操作日志

### 3.6 重置用户密码

**接口路径**: `POST /api/v1/users/{id}/reset-password`

**权限要求**: 管理员

**入参**:

```typescript
interface ResetUserPasswordRequest {
  newPassword: string;
}
```

**出参**:

```typescript
interface ResetUserPasswordResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可重置
2. 加密新密码并更新
3. 记录操作日志

---

## 4. 部门管理模块 (departments)

### 4.1 获取部门列表

**接口路径**: `GET /api/v1/departments`

**权限要求**: 所有登录用户

**入参**:

```typescript
interface GetDepartmentsRequest extends PaginationParams {
  keyword?: string; // 搜索关键词
  status?: "ACTIVE" | "DISABLED";
  orgId?: string;
  parentId?: string;
  includeChildren?: boolean; // 是否包含子部门
}
```

**出参**:

```typescript
interface GetDepartmentsResponse {
  departments: Array<{
    id: string;
    name: string;
    status: "ACTIVE" | "DISABLED";
    level: number;
    parent?: {
      id: string;
      name: string;
    };
    leader?: {
      id: string;
      username: string;
    };
    org?: {
      id: string;
      name: string;
    };
    children?: Array<{
      id: string;
      name: string;
      level: number;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色返回可见部门
2. 支持关键词搜索部门名称
3. 支持按状态、组织筛选
4. 支持树形结构展示
5. 部门负责人可查看本部门及下属部门

### 4.2 获取部门详情

**接口路径**: `GET /api/v1/departments/{id}`

**权限要求**: 所有登录用户

**入参**: 无

**出参**:

```typescript
interface GetDepartmentDetailResponse {
  id: string;
  name: string;
  status: "ACTIVE" | "DISABLED";
  level: number;
  parent?: {
    id: string;
    name: string;
  };
  children: Array<{
    id: string;
    name: string;
    level: number;
    userCount: number;
  }>;
  leader?: {
    id: string;
    username: string;
    email?: string;
  };
  org?: {
    id: string;
    name: string;
  };
  userCount: number;
  postCount: number;
  candidateCount: number;
  createdAt: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 返回部门详细信息
2. 统计部门下用户、岗位、候选人数量
3. 显示上级和下级部门信息
4. 记录查询日志

### 4.3 创建部门

**接口路径**: `POST /api/v1/departments`

**权限要求**: 管理员，管理员（可创建子部门）

**入参**:

```typescript
interface CreateDepartmentRequest {
  name: string;
  parentId?: string;
  leaderId?: string;
  orgId?: string;
  status?: "ACTIVE" | "DISABLED";
}
```

**出参**:

```typescript
interface CreateDepartmentResponse {
  id: string;
  name: string;
  level: number;
  status: "ACTIVE" | "DISABLED";
}
```

**业务逻辑**:

1. 权限验证：仅管理员可创建
2. 验证部门名称在同级别的唯一性
3. 自动计算部门层级
4. 验证负责人的有效性
5. 记录操作日志

### 4.4 更新部门

**接口路径**: `PUT /api/v1/departments/{id}`

**权限要求**: 管理员，部门负责人（可以更新自己管理的部门）

**入参**:

```typescript
interface UpdateDepartmentRequest {
  name?: string;
  parentId?: string;
  leaderId?: string;
  orgId?: string;
  status?: "ACTIVE" | "DISABLED";
}
```

**出参**:

```typescript
interface UpdateDepartmentResponse {
  id: string;
  name: string;
  level: number;
  status: "ACTIVE" | "DISABLED";
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可更新
2. 验证部门名称的唯一性
3. 如果更改上级部门，重新计算层级
4. 验证不能设置自己或下级部门为上级
5. 记录操作日志

### 4.5 删除部门

**接口路径**: `DELETE /api/v1/departments/{id}`

**权限要求**: 管理员，管理员（删除子部门）

**入参**: 无

**出参**:

```typescript
interface DeleteDepartmentResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可删除
2. 检查部门下是否有用户、岗位、候选人
3. 检查是否有子部门
4. 执行软删除
5. 记录操作日志

---

## 5. 角色权限模块 (roles)

### 5.1 获取角色列表

**接口路径**: `GET /api/v1/roles`

**权限要求**: 管理员

**入参**:

```typescript
interface GetRolesRequest extends PaginationParams {
  keyword?: string;
  isSystem?: boolean;
}
```

**出参**:

```typescript
interface GetRolesResponse {
  roles: Array<{
    id: string;
    name: string;
    code?: string;
    description?: string;
    isSystem: boolean;
    userCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可访问
2. 支持关键词搜索
3. 支持按系统/自定义筛选
4. 统计角色下用户数量

### 5.2 获取权限列表

**接口路径**: `GET /api/v1/permissions`

**权限要求**: 管理员

**入参**: 无

**出参**:

```typescript
interface GetPermissionsResponse {
  permissions: Array<{
    id: string;
    name: string;
    code?: string;
    type: "MENU" | "BUTTON";
    parentId?: string;
    children?: Array<{
      id: string;
      name: string;
      code?: string;
      type: "MENU" | "BUTTON";
    }>;
  }>;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可访问
2. 返回树形权限结构
3. 区分菜单和按钮权限

### 5.3 创建角色

**接口路径**: `POST /api/v1/roles`

**权限要求**: 管理员

**入参**:

```typescript
interface CreateRoleRequest {
  name: string;
  code?: string;
  description?: string;
  permissionIds: string[];
}
```

**出参**:

```typescript
interface CreateRoleResponse {
  id: string;
  name: string;
  code?: string;
  description?: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可创建
2. 验证角色名称和编码的唯一性
3. 关联权限
4. 记录操作日志

### 5.4 更新角色

**接口路径**: `PUT /api/v1/roles/{id}`

**权限要求**: 管理员

**入参**:

```typescript
interface UpdateRoleRequest {
  name?: string;
  code?: string;
  description?: string;
  permissionIds?: string[];
}
```

**出参**:

```typescript
interface UpdateRoleResponse {
  id: string;
  name: string;
  code?: string;
  description?: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可更新
2. 检查是否为系统角色（不可修改）
3. 验证名称和编码的唯一性
4. 更新权限关联
5. 记录操作日志

### 5.5 获取用户菜单

**接口路径**: `GET /api/v1/users/menu`

**权限要求**: 所有登录用户

**入参**: 无

**出参**:

```typescript
interface GetUserMenuResponse {
  menus: Array<{
    id: string;
    name: string;
    code?: string;
    type: "MENU" | "BUTTON";
    parentId?: string;
    path?: string; // 前端路由路径
    icon?: string; // 图标
    sort?: number; // 排序
    hidden?: boolean; // 是否隐藏
    children?: Array<{
      id: string;
      name: string;
      code?: string;
      type: "MENU" | "BUTTON";
      path?: string;
      icon?: string;
      sort?: number;
      hidden?: boolean;
      children?: Array<{
        id: string;
        name: string;
        code?: string;
        type: "MENU" | "BUTTON";
        path?: string;
        icon?: string;
        sort?: number;
        hidden?: boolean;
      }>;
    }>;
  }>;
  buttons: string[]; // 按钮权限编码列表
}
```

**业务逻辑**:

1. 根据用户角色获取权限列表
2. 筛选出菜单类型的权限
3. 构建树形菜单结构
4. 按sort字段排序
5. 过滤隐藏的菜单项
6. 返回按钮权限编码列表用于页面按钮控制
7. 记录查询日志

### 5.6 检查用户权限

**接口路径**: `POST /api/v1/users/check-permission`

**权限要求**: 所有登录用户

**入参**:

```typescript
interface CheckPermissionRequest {
  permissionCodes: string[]; // 需要检查的权限编码列表
}
```

**出参**:

```typescript
interface CheckPermissionResponse {
  permissions: Record<string, boolean>; // 权限编码 -> 是否有权限的映射
}
```

**业务逻辑**:

1. 获取用户的所有权限
2. 检查每个权限编码是否在用户权限列表中
3. 返回权限检查结果映射
4. 用于前端动态控制按钮、链接等元素的显示

---

## 6. 岗位管理模块 (posts)

### 6.1 获取岗位列表

**接口路径**: `GET /api/v1/posts`

**权限要求**: HR、管理员、部门负责人

**入参**:

```typescript
interface GetPostsRequest extends PaginationParams {
  keyword?: string;
  status?: "OPEN" | "PAUSED" | "CLOSED";
  departmentId?: string;
  location?: string;
  priority?: number;
  createdById?: string;
}
```

**出参**:

```typescript
interface GetPostsResponse {
  posts: Array<{
    id: string;
    name: string;
    status: "OPEN" | "PAUSED" | "CLOSED";
    hiringCount?: number;
    priority?: number;
    location?: string;
    department: {
      id: string;
      name: string;
    };
    createdBy: {
      id: string;
      username: string;
    };
    candidateCount: number;
    interviewCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色过滤可见岗位
2. 部门负责人只能查看本部门岗位
3. 支持关键词搜索岗位名称
4. 支持多维度筛选
5. 统计关联的候选人和面试数量

### 6.2 获取岗位详情

**接口路径**: `GET /api/v1/posts/{id}`

**权限要求**: HR、管理员、部门负责人

**入参**: 无

**出参**:

```typescript
interface GetPostDetailResponse {
  id: string;
  name: string;
  jd?: string;
  hiringCount?: number;
  priority?: number;
  location?: string;
  status: "OPEN" | "PAUSED" | "CLOSED";
  department: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    username: string;
  };
  candidateCount: number;
  interviewCount: number;
  closedAt?: string;
  restoredAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：检查用户是否有权限查看该岗位
2. 返回岗位完整信息
3. 统计关联数据
4. 记录查询日志

### 6.3 创建岗位

**接口路径**: `POST /api/v1/posts`

**权限要求**: HR、管理员

**入参**:

```typescript
interface CreatePostRequest {
  name: string;
  departmentId: string;
  jd?: string;
  hiringCount?: number;
  priority?: number;
  location?: string;
  status?: "OPEN" | "PAUSED" | "CLOSED";
}
```

**出参**:

```typescript
interface CreatePostResponse {
  id: string;
  name: string;
  status: "OPEN" | "PAUSED" | "CLOSED";
  department: {
    id: string;
    name: string;
  };
}
```

**业务逻辑**:

1. 权限验证：仅HR和管理员可创建
2. 验证部门的有效性
3. 记录创建人信息
4. 默认状态为OPEN
5. 记录操作日志

### 6.4 更新岗位

**接口路径**: `PUT /api/v1/posts/{id}`

**权限要求**: HR、管理员、岗位创建者

**入参**:

```typescript
interface UpdatePostRequest {
  name?: string;
  departmentId?: string;
  jd?: string;
  hiringCount?: number;
  priority?: number;
  location?: string;
  status?: "OPEN" | "PAUSED" | "CLOSED";
}
```

**出参**:

```typescript
interface UpdatePostResponse {
  id: string;
  name: string;
  status: "OPEN" | "PAUSED" | "CLOSED";
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：HR、管理员或岗位创建者可更新
2. 如果状态变更为CLOSED，自动设置closedAt
3. 如果从CLOSED恢复，设置restoredAt
4. 状态变更影响候选人流程
5. 记录操作日志

### 6.5 删除岗位

**接口路径**: `DELETE /api/v1/posts/{id}`

**权限要求**: 管理员

**入参**: 无

**出参**:

```typescript
interface DeletePostResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可删除
2. 检查是否有关联的候选人
3. 执行软删除
4. 终止相关的面试流程
5. 记录操作日志

---

## 7. 候选人管理模块 (candidates)

### 7.1 获取候选人列表

**接口路径**: `GET /api/v1/candidates`

**权限要求**: HR、管理员、面试官、部门负责人

**入参**:

```typescript
interface GetCandidatesRequest extends PaginationParams {
  keyword?: string;
  status?:
    | "NEW"
    | "DEPARTMENT_ASSESSING"
    | "DEPARTMENT_PASSED"
    | "DEPARTMENT_FAILED"
    | "INTERVIEWING"
    | "OFFERED"
    | "REJECTED";
  departmentId?: string;
  postId?: string;
  source?: string;
  workExperience?: number;
  createdById?: string;
}
```

**出参**:

```typescript
interface GetCandidatesResponse {
  candidates: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    status:
      | "NEW"
      | "DEPARTMENT_ASSESSING"
      | "DEPARTMENT_PASSED"
      | "DEPARTMENT_FAILED"
      | "INTERVIEWING"
      | "OFFERED"
      | "REJECTED";
    source?: string;
    expectedSalary?: string;
    currentCompany?: string;
    workExperience?: number;
    department: {
      id: string;
      name: string;
    };
    post: {
      id: string;
      name: string;
    };
    createdBy: {
      id: string;
      username: string;
    };
    resumeUrl?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色过滤可见候选人
2. 面试官只能查看分配给自己的候选人
3. 部门负责人可查看本部门候选人
4. 支持多维度搜索和筛选
5. 记录查询日志

### 7.2 获取候选人详情

**接口路径**: `GET /api/v1/candidates/{id}`

**权限要求**: HR、管理员、面试官、部门负责人

**入参**: 无

**出参**:

```typescript
interface GetCandidateDetailResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  remarks?: string;
  status:
    | "NEW"
    | "DEPARTMENT_ASSESSING"
    | "DEPARTMENT_PASSED"
    | "DEPARTMENT_FAILED"
    | "INTERVIEWING"
    | "OFFERED"
    | "REJECTED";
  source?: string;
  expectedSalary?: string;
  currentCompany?: string;
  workExperience?: number;
  department: {
    id: string;
    name: string;
  };
  post: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    username: string;
  };
  assessments: Array<{
    id: string;
    result: "PASSED" | "FAILED" | "PENDING";
    remarks?: string;
    assessor: {
      id: string;
      username: string;
    };
    assessedAt: string;
  }>;
  interviews: Array<{
    id: string;
    round: number;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    scheduledAt: string;
  }>;
  statusHistory: Array<{
    id: string;
    fromStatus?: string;
    toStatus: string;
    reason?: string;
    operator: {
      id: string;
      username: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：检查用户是否有权限查看该候选人
2. 返回候选人完整信息
3. 包含评定记录、面试历史、状态变更记录
4. 记录查询日志

### 7.3 创建候选人

**接口路径**: `POST /api/v1/candidates`

**权限要求**: HR、管理员、面试官

**入参**:

```typescript
interface CreateCandidateRequest {
  name: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  remarks?: string;
  source?: string;
  expectedSalary?: string;
  currentCompany?: string;
  workExperience?: number;
  departmentId: string;
  postId: string;
}
```

**出参**:

```typescript
interface CreateCandidateResponse {
  id: string;
  name: string;
  status: "NEW";
  department: {
    id: string;
    name: string;
  };
  post: {
    id: string;
    name: string;
  };
}
```

**业务逻辑**:

1. 权限验证：HR、管理员、面试官可创建
2. 验证部门和岗位的有效性
3. 默认状态为NEW
4. 自动流转到部门评定
5. 记录操作日志

### 7.4 批量导入候选人

**接口路径**: `POST /api/v1/candidates/batch-import`

**权限要求**: HR、管理员

**入参**:

```typescript
interface BatchImportCandidatesRequest {
  candidates: Array<{
    name: string;
    email?: string;
    phone?: string;
    resumeUrl?: string;
    remarks?: string;
    source?: string;
    expectedSalary?: string;
    currentCompany?: string;
    workExperience?: number;
    departmentId: string;
    postId: string;
  }>;
}
```

**出参**:

```typescript
interface BatchImportCandidatesResponse {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    name: string;
    error: string;
  }>;
}
```

**业务逻辑**:

1. 权限验证：仅HR和管理员可导入
2. 批量验证候选人数据
3. 逐条创建候选人，记录成功/失败
4. 自动流转到部门评定
5. 记录操作日志

### 7.5 更新候选人状态

**接口路径**: `PUT /api/v1/candidates/{id}/status`

**权限要求**: HR、管理员、面试官、部门负责人

**入参**:

```typescript
interface UpdateCandidateStatusRequest {
  status:
    | "NEW"
    | "DEPARTMENT_ASSESSING"
    | "DEPARTMENT_PASSED"
    | "DEPARTMENT_FAILED"
    | "INTERVIEWING"
    | "OFFERED"
    | "REJECTED";
  reason?: string;
}
```

**出参**:

```typescript
interface UpdateCandidateStatusResponse {
  id: string;
  status: string;
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：根据状态流转规则验证权限
2. 验证状态流转的合法性
3. 记录状态变更历史
4. 触发相应的业务流程
5. 发送通知
6. 记录操作日志

---

## 8. 部门评定模块 (assessments)

### 8.1 获取评定列表

**接口路径**: `GET /api/v1/assessments`

**权限要求**: 部门负责人、HR、管理员

**入参**:

```typescript
interface GetAssessmentsRequest extends PaginationParams {
  candidateId?: string;
  assessorId?: string;
  result?: "PASSED" | "FAILED" | "PENDING";
  departmentId?: string;
}
```

**出参**:

```typescript
interface GetAssessmentsResponse {
  assessments: Array<{
    id: string;
    candidate: {
      id: string;
      name: string;
      email?: string;
    };
    assessor: {
      id: string;
      username: string;
    };
    result: "PASSED" | "FAILED" | "PENDING";
    remarks?: string;
    assessedAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色过滤可见评定
2. 部门负责人只能查看本部门评定
3. 支持按候选人、评定人、结果筛选
4. 记录查询日志

### 8.2 创建评定

**接口路径**: `POST /api/v1/assessments`

**权限要求**: 部门负责人、指定评定人

**入参**:

```typescript
interface CreateAssessmentRequest {
  candidateId: string;
  result: "PASSED" | "FAILED" | "PENDING";
  remarks?: string;
}
```

**出参**:

```typescript
interface CreateAssessmentResponse {
  id: string;
  result: "PASSED" | "FAILED" | "PENDING";
  assessedAt: string;
}
```

**业务逻辑**:

1. 权限验证：检查是否有权限评定该候选人
2. 检查候选人状态是否为DEPARTMENT_ASSESSING
3. 创建评定记录
4. 如果是最后一个评定，自动流转候选人状态
5. 发送通知
6. 记录操作日志

### 8.3 更新评定

**接口路径**: `PUT /api/v1/assessments/{id}`

**权限要求**: 评定创建者、管理员

**入参**:

```typescript
interface UpdateAssessmentRequest {
  result?: "PASSED" | "FAILED" | "PENDING";
  remarks?: string;
}
```

**出参**:

```typescript
interface UpdateAssessmentResponse {
  id: string;
  result: "PASSED" | "FAILED" | "PENDING";
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅评定创建者或管理员可更新
2. 检查评定是否可修改
3. 更新评定结果
4. 重新计算候选人状态
5. 记录操作日志

---

## 9. 面试管理模块 (interviews)

### 9.1 获取面试列表

**接口路径**: `GET /api/v1/interviews`

**权限要求**: HR、管理员、面试官

**入参**:

```typescript
interface GetInterviewsRequest extends PaginationParams {
  candidateId?: string;
  postId?: string;
  status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  round?: number;
  interviewerId?: string;
  startDate?: string;
  endDate?: string;
}
```

**出参**:

```typescript
interface GetInterviewsResponse {
  interviews: Array<{
    id: string;
    candidate: {
      id: string;
      name: string;
    };
    post: {
      id: string;
      name: string;
    };
    round: number;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    scheduledAt: string;
    location?: string;
    meetingLink?: string;
    interviewTasks: Array<{
      id: string;
      interviewer: {
        id: string;
        username: string;
      };
      status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      sequence: number;
    }>;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色过滤可见面试
2. 面试官只能查看分配给自己的面试
3. 支持多维度筛选
4. 记录查询日志

### 9.2 获取我的面试

**接口路径**: `GET /api/v1/interviews/my`

**权限要求**: 面试官

**入参**:

```typescript
interface GetMyInterviewsRequest extends PaginationParams {
  status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}
```

**出参**:

```typescript
interface GetMyInterviewsResponse {
  interviews: Array<{
    taskId: string;
    interview: {
      id: string;
      round: number;
      scheduledAt: string;
      location?: string;
      meetingLink?: string;
    };
    candidate: {
      id: string;
      name: string;
      resumeUrl?: string;
    };
    post: {
      id: string;
      name: string;
    };
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    sequence: number;
    feedback?: string;
    feedbackScore?: number;
    decision?: string;
  }>;
}
```

**业务逻辑**:

1. 查询当前用户作为面试官的面试任务
2. 按时间排序
3. 仅显示自己负责的面试环节
4. 记录查询日志

### 9.3 创建面试

**接口路径**: `POST /api/v1/interviews`

**权限要求**: HR、管理员

**入参**:

```typescript
interface CreateInterviewRequest {
  candidateId: string;
  postId: string;
  round: number;
  scheduledAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  interviewTasks: Array<{
    interviewerId: string;
    sequence: number;
    scheduledAt?: string;
  }>;
}
```

**出参**:

```typescript
interface CreateInterviewResponse {
  id: string;
  round: number;
  status: "SCHEDULED";
  scheduledAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅HR和管理员可创建
2. 验证候选人状态是否可进入面试
3. 创建面试主记录和子任务
4. 发送面试邀约通知
5. 更新候选人状态为INTERVIEWING
6. 记录操作日志

### 9.4 开始面试

**接口路径**: `POST /api/v1/interviews/tasks/{taskId}/start`

**权限要求**: 面试官（任务分配者）

**入参**: 无

**出参**:

```typescript
interface StartInterviewResponse {
  taskId: string;
  status: "IN_PROGRESS";
  actualStartAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅分配的面试官可开始
2. 更新任务状态为IN_PROGRESS
3. 记录实际开始时间
4. 如果是第一个任务开始，更新面试主状态
5. 记录操作日志

### 9.5 提交面试反馈

**接口路径**: `POST /api/v1/interviews/tasks/{taskId}/feedback`

**权限要求**: 面试官（任务分配者）

**入参**:

```typescript
interface SubmitFeedbackRequest {
  feedback: string;
  feedbackScore?: number;
  decision: string;
}
```

**出参**:

```typescript
interface SubmitFeedbackResponse {
  taskId: string;
  status: "COMPLETED";
  feedbackAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅分配的面试官可提交
2. 更新任务状态为COMPLETED
3. 记录反馈内容和时间
4. 检查是否所有任务都已完成，更新面试主状态
5. 如果面试完成，可触发候选人状态流转
6. 发送通知
7. 记录操作日志

### 9.6 取消面试

**接口路径**: `POST /api/v1/interviews/{id}/cancel`

**权限要求**: HR、管理员、面试官

**入参**:

```typescript
interface CancelInterviewRequest {
  reason?: string;
}
```

**出参**:

```typescript
interface CancelInterviewResponse {
  id: string;
  status: "CANCELLED";
  updatedAt: string;
}
```

**业务逻辑**:

1. 权限验证：HR、管理员、相关面试官可取消
2. 更新面试和所有任务状态为CANCELLED
3. 发送取消通知
4. 记录取消原因
5. 记录操作日志

---

## 10. 通知模块 (notifications)

### 10.1 获取通知列表

**接口路径**: `GET /api/v1/notifications`

**权限要求**: 所有登录用户

**入参**:

```typescript
interface GetNotificationsRequest extends PaginationParams {
  type?: "SYSTEM" | "EMAIL" | "SMS";
  isRead?: boolean;
}
```

**出参**:

```typescript
interface GetNotificationsResponse {
  notifications: Array<{
    id: string;
    type: "SYSTEM" | "EMAIL" | "SMS";
    title: string;
    content: string;
    isRead: boolean;
    sentAt: string;
    relatedPost?: {
      id: string;
      name: string;
    };
    relatedCandidate?: {
      id: string;
      name: string;
    };
  }>;
}
```

**业务逻辑**:

1. 查询当前用户的通知
2. 支持按类型、阅读状态筛选
3. 按时间倒序排列
4. 记录查询日志

### 10.2 标记通知已读

**接口路径**: `PUT /api/v1/notifications/{id}/read`

**权限要求**: 通知接收者

**入参**: 无

**出参**:

```typescript
interface MarkNotificationReadResponse {
  id: string;
  isRead: boolean;
}
```

**业务逻辑**:

1. 权限验证：仅通知接收者可标记
2. 更新通知状态为已读
3. 记录操作时间

### 10.3 批量标记已读

**接口路径**: `PUT /api/v1/notifications/batch-read`

**权限要求**: 所有登录用户

**入参**:

```typescript
interface BatchMarkReadRequest {
  notificationIds: string[];
}
```

**出参**:

```typescript
interface BatchMarkReadResponse {
  updatedCount: number;
}
```

**业务逻辑**:

1. 批量更新用户的通知状态
2. 只更新属于当前用户的通知
3. 返回更新数量

---

## 11. 系统管理模块 (system)

### 11.1 获取首页数据

**接口路径**: `GET /api/v1/system/dashboard`

**权限要求**: 所有登录用户

**入参**: 无

**出参**:

```typescript
interface GetDashboardResponse {
  statistics: {
    totalUsers: number;
    totalPosts: number;
    totalCandidates: number;
    totalInterviews: number;
    monthlyNewCandidates: number;
    monthlyCompletedInterviews: number;
  };
  todoItems: Array<{
    type: "assessment" | "interview" | "feedback";
    count: number;
    description: string;
  }>;
  departmentRankings: Array<{
    departmentId: string;
    departmentName: string;
    completedCount: number;
    successRate: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户角色返回相应的统计数据
2. 计算待办事项
3. 统计部门排行
4. 展示最近活动
5. 记录访问日志

### 11.2 获取操作日志

**接口路径**: `GET /api/v1/system/logs`

**权限要求**: 管理员

**入参**:

```typescript
interface GetLogsRequest extends PaginationParams {
  userId?: string;
  module?: string;
  action?: string;
  objectType?: string;
  objectId?: string;
  result?: "SUCCESS" | "FAILED" | "PARTIAL";
  startDate?: string;
  endDate?: string;
}
```

**出参**:

```typescript
interface GetLogsResponse {
  logs: Array<{
    id: string;
    user: {
      id: string;
      username: string;
    };
    action: string;
    module: string;
    objectType?: string;
    objectId?: string;
    objectName?: string;
    result: "SUCCESS" | "FAILED" | "PARTIAL";
    errorMsg?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
  }>;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可查看
2. 支持多维度筛选
3. 按时间倒序排列
4. 记录查询日志

### 11.3 导出数据

**接口路径**: `POST /api/v1/system/export`

**权限要求**: 管理员

**入参**:

```typescript
interface ExportDataRequest {
  type:
    | "users"
    | "departments"
    | "posts"
    | "candidates"
    | "interviews"
    | "logs";
  filters?: Record<string, any>;
  format?: "xlsx" | "csv";
}
```

**出参**:

```typescript
interface ExportDataResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}
```

**业务逻辑**:

1. 权限验证：仅管理员可导出
2. 根据类型和筛选条件查询数据
3. 生成Excel或CSV文件
4. 返回下载链接
5. 记录导出日志

---

## 12. 文件管理模块 (files)

### 12.1 上传文件

**接口路径**: `POST /api/v1/files/upload`

**权限要求**: 所有登录用户

**入参**: FormData

```typescript
interface UploadFileRequest {
  file: File;
  category?:
    | "RESUME"
    | "PORTFOLIO"
    | "CERTIFICATE"
    | "JOB_DESCRIPTION"
    | "INTERVIEW_FEEDBACK"
    | "CONTRACT"
    | "OTHER";
  entityType?: string;
  entityId?: string;
  description?: string;
}
```

**出参**:

```typescript
interface UploadFileResponse {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  category: string;
}
```

**业务逻辑**:

1. 验证文件类型和大小
2. 生成唯一文件名
3. 上传到存储服务
4. 记录文件信息
5. 返回访问URL
6. 记录操作日志

### 12.2 获取文件列表

**接口路径**: `GET /api/v1/files`

**权限要求**: 所有登录用户

**入参**:

```typescript
interface GetFilesRequest extends PaginationParams {
  category?:
    | "RESUME"
    | "PORTFOLIO"
    | "CERTIFICATE"
    | "JOB_DESCRIPTION"
    | "INTERVIEW_FEEDBACK"
    | "CONTRACT"
    | "OTHER";
  entityType?: string;
  entityId?: string;
  uploaderId?: string;
}
```

**出参**:

```typescript
interface GetFilesResponse {
  files: Array<{
    id: string;
    url: string;
    filename: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    category: string;
    description?: string;
    entityType?: string;
    entityId?: string;
    uploader: {
      id: string;
      username: string;
    };
    createdAt: string;
  }>;
}
```

**业务逻辑**:

1. 根据用户权限过滤可见文件
2. 支持按分类、关联实体筛选
3. 返回文件列表
4. 记录查询日志

### 12.3 删除文件

**接口路径**: `DELETE /api/v1/files/{id}`

**权限要求**: 文件上传者、管理员

**入参**: 无

**出参**:

```typescript
interface DeleteFileResponse {
  success: boolean;
  message: string;
}
```

**业务逻辑**:

1. 权限验证：仅上传者或管理员可删除
2. 从存储服务删除文件
3. 软删除文件记录
4. 记录操作日志

---

## 13. 统计分析模块 (analytics)

### 13.1 获取招聘统计

**接口路径**: `GET /api/v1/analytics/recruitment`

**权限要求**: HR、管理员、部门负责人

**入参**:

```typescript
interface GetRecruitmentAnalyticsRequest {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  postId?: string;
}
```

**出参**:

```typescript
interface GetRecruitmentAnalyticsResponse {
  summary: {
    totalCandidates: number;
    passedAssessment: number;
    inInterview: number;
    offered: number;
    rejected: number;
    conversionRate: number;
  };
  trends: Array<{
    date: string;
    newCandidates: number;
    completedInterviews: number;
    offers: number;
  }>;
  departmentStats: Array<{
    departmentId: string;
    departmentName: string;
    candidateCount: number;
    offerCount: number;
    successRate: number;
  }>;
  postStats: Array<{
    postId: string;
    postName: string;
    candidateCount: number;
    avgProcessTime: number;
  }>;
}
```

**业务逻辑**:

1. 根据用户权限过滤数据范围
2. 计算各项统计指标
3. 生成趋势图数据
4. 统计部门和岗位数据
5. 记录查询日志

### 13.2 获取面试统计

**接口路径**: `GET /api/v1/analytics/interviews`

**权限要求**: HR、管理员、面试官

**入参**:

```typescript
interface GetInterviewAnalyticsRequest {
  startDate?: string;
  endDate?: string;
  interviewerId?: string;
  departmentId?: string;
}
```

**出参**:

```typescript
interface GetInterviewAnalyticsResponse {
  summary: {
    totalInterviews: number;
    completedInterviews: number;
    cancelledInterviews: number;
    avgDuration: number;
    avgScore: number;
  };
  interviewerStats: Array<{
    interviewerId: string;
    interviewerName: string;
    interviewCount: number;
    avgScore: number;
    passRate: number;
  }>;
  timeDistribution: Array<{
    hour: number;
    count: number;
  }>;
}
```

**业务逻辑**:

1. 根据用户权限过滤数据
2. 计算面试相关统计
3. 分析面试官表现
4. 统计时间分布
5. 记录查询日志

---

## 14. 错误处理和状态码说明

### 14.1 业务错误码

- 40001: 用户名已存在
- 40002: 邮箱已存在
- 40003: 手机号已存在
- 40004: 工号已存在
- 40101: 用户未激活
- 40102: 用户已被禁用
- 40201: 部门不存在
- 40202: 部门下有子部门，无法删除
- 40203: 部门下有用户，无法删除
- 40301: 岗位不存在
- 40302: 岗位已关闭
- 40401: 候选人不存在
- 40402: 候选人状态不允许该操作
- 40501: 面试不存在
- 40502: 面试已取消
- 40503: 不在面试时间范围内

### 14.2 权限错误码

- 40300: 权限不足
- 40301: 无权限访问该资源
- 40302: 无权限执行该操作

### 14.3 文件错误码

- 41001: 文件类型不支持
- 41002: 文件大小超出限制
- 41003: 文件上传失败

---

## 15. 接口调用示例

### 15.1 用户登录示例

```typescript
// 请求
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "123456",
  "rememberMe": true
}

// 响应
{
  "success": true,
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "emailVerified": true,
      "status": "ACTIVE",
      "roles": [
        {
          "id": "role-uuid",
          "name": "管理员",
          "code": "ADMIN"
        }
      ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token",
    "expiresIn": 7200
  }
}
```

### 15.2 创建候选人示例

```typescript
// 请求
POST /api/v1/candidates
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "source": "网申",
  "expectedSalary": "15-20K",
  "currentCompany": "某科技公司",
  "workExperience": 3,
  "departmentId": "dept-uuid",
  "postId": "post-uuid",
  "remarks": "技术不错，沟通能力强"
}

// 响应
{
  "success": true,
  "code": 200,
  "message": "候选人创建成功",
  "data": {
    "id": "candidate-uuid",
    "name": "张三",
    "status": "NEW",
    "department": {
      "id": "dept-uuid",
      "name": "技术部"
    },
    "post": {
      "id": "post-uuid",
      "name": "前端工程师"
    }
  }
}
```

### 15.3 获取用户菜单示例

```typescript
// 请求
GET /api/v1/users/menu
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 响应
{
  "success": true,
  "code": 200,
  "message": "获取菜单成功",
  "data": {
    "menus": [
      {
        "id": "menu-1",
        "name": "首页",
        "code": "DASHBOARD",
        "type": "MENU",
        "path": "/dashboard",
        "icon": "home",
        "sort": 1,
        "hidden": false,
        "children": []
      },
      {
        "id": "menu-2",
        "name": "系统管理",
        "code": "SYSTEM",
        "type": "MENU",
        "path": "/system",
        "icon": "setting",
        "sort": 2,
        "hidden": false,
        "children": [
          {
            "id": "menu-2-1",
            "name": "用户管理",
            "code": "USER_MANAGE",
            "type": "MENU",
            "path": "/system/users",
            "icon": "user",
            "sort": 1,
            "hidden": false,
            "children": [
              {
                "id": "menu-2-1-1",
                "name": "新增用户",
                "code": "USER_CREATE",
                "type": "BUTTON",
                "sort": 1,
                "hidden": false
              }
            ]
          },
          {
            "id": "menu-2-2",
            "name": "部门管理",
            "code": "DEPT_MANAGE",
            "type": "MENU",
            "path": "/system/departments",
            "icon": "apartment",
            "sort": 2,
            "hidden": false
          }
        ]
      },
      {
        "id": "menu-3",
        "name": "招聘管理",
        "code": "RECRUITMENT",
        "type": "MENU",
        "path": "/recruitment",
        "icon": "team",
        "sort": 3,
        "hidden": false,
        "children": [
          {
            "id": "menu-3-1",
            "name": "岗位管理",
            "code": "POST_MANAGE",
            "type": "MENU",
            "path": "/recruitment/posts",
            "icon": "solution",
            "sort": 1,
            "hidden": false
          },
          {
            "id": "menu-3-2",
            "name": "候选人管理",
            "code": "CANDIDATE_MANAGE",
            "type": "MENU",
            "path": "/recruitment/candidates",
            "icon": "user-switch",
            "sort": 2,
            "hidden": false
          },
          {
            "id": "menu-3-3",
            "name": "面试管理",
            "code": "INTERVIEW_MANAGE",
            "type": "MENU",
            "path": "/recruitment/interviews",
            "icon": "video-camera",
            "sort": 3,
            "hidden": false
          }
        ]
      }
    ],
    "buttons": [
      "USER_CREATE",
      "USER_EDIT",
      "USER_DELETE",
      "DEPT_CREATE",
      "DEPT_EDIT",
      "POST_CREATE",
      "POST_EDIT",
      "POST_STATUS_CHANGE",
      "CANDIDATE_CREATE",
      "CANDIDATE_EDIT",
      "CANDIDATE_STATUS_CHANGE",
      "INTERVIEW_CREATE",
      "INTERVIEW_CANCEL",
      "INTERVIEW_FEEDBACK"
    ]
  }
}
```

### 15.4 获取当前用户信息示例

```typescript
// 请求
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 响应
{
  "success": true,
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "id": "user-uuid",
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "emailVerified": true,
    "employeeNo": "EMP001",
    "phone": "13800138000",
    "status": "ACTIVE",
    "department": {
      "id": "dept-uuid",
      "name": "技术部",
      "parent": {
        "id": "parent-dept-uuid",
        "name": "研发中心"
      }
    },
    "roles": [
      {
        "id": "role-uuid",
        "name": "HR专员",
        "code": "HR_SPECIALIST",
        "description": "负责招聘相关工作"
      }
    ],
    "permissions": [
      "DASHBOARD",
      "POST_MANAGE",
      "POST_CREATE",
      "POST_EDIT",
      "CANDIDATE_MANAGE",
      "CANDIDATE_CREATE",
      "CANDIDATE_EDIT",
      "INTERVIEW_MANAGE"
    ],
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-15T14:30:00Z"
  }
}
```

---

这份接口设计文档涵盖了招聘系统的所有核心功能模块，每个接口都包含了详细的路径、权限要求、入参出参格式以及业务逻辑说明。您可以按照这个设计进行具体的实现。如果需要调整某个模块的接口设计，请告诉我具体需求。
