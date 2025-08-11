# Gateway 集中鉴权系统

## 概述

实现了基于Gateway的集中鉴权系统，所有API请求的权限验证都在Gateway层完成，Server端只需要处理业务逻辑。

## 核心组件

### 1. 权限配置 (`permission-config.ts`)

- 定义了所有API的权限要求
- 支持角色、权限码、部门权限等多维度控制
- 支持参数化路径匹配（如 `/users/:id`）

### 2. 权限服务 (`PermissionService`)

- 核心权限验证逻辑
- 支持路径匹配和权限检查
- 提供权限调试功能

### 3. API权限守卫 (`ApiPermissionGuard`)

- 在代理转发前检查权限
- 详细的日志记录
- 自动区分认证错误和授权错误

### 4. 增强的角色守卫 (`RolesGuard`)

- 支持角色和权限码双重验证
- 可通过装饰器灵活配置

## 使用方法

### 权限配置示例

```typescript
// 在 permission-config.ts 中添加新的API权限配置
{
  path: '/posts',
  method: 'POST',
  permissions: ['post:create'],
  roles: ['hr', 'admin'],
  description: '创建岗位'
}
```

### 装饰器使用示例

```typescript
// 在Gateway的控制器中使用装饰器
@Controller("special")
export class SpecialController {
  @Get("admin-only")
  @RequireAdmin()
  adminOnlyEndpoint() {
    return { message: "仅管理员可访问" };
  }

  @Post("hr-function")
  @RequireHR()
  hrFunction() {
    return { message: "HR和管理员可访问" };
  }

  @Get("custom-permission")
  @Permissions("custom:read")
  customPermission() {
    return { message: "需要特定权限" };
  }
}
```

## API接口

### 权限检查接口

1. **获取我的权限**

   ```
   GET /api/auth/permissions/my-access
   ```

   返回当前用户可访问的所有路径

2. **检查特定权限**

   ```
   GET /api/auth/permissions/check?path=/users&method=GET
   ```

   检查用户是否有权限访问特定路径

3. **查看权限配置**（仅管理员）
   ```
   GET /api/auth/permissions/rules
   ```
   查看所有权限规则配置

## 工作流程

1. **请求到达Gateway**
   - 用户发送请求到Gateway

2. **JWT认证**
   - JwtAuthGuard验证用户身份
   - 解析用户信息（角色、权限、部门等）

3. **权限验证**
   - ApiPermissionGuard检查用户是否有权限访问该API
   - 基于配置的权限规则进行验证

4. **请求转发**
   - 权限验证通过后，ProxyService转发请求到Server
   - 在请求头中携带用户信息

5. **Server处理**
   - Server接收请求，从请求头获取用户信息
   - 专注于业务逻辑处理，无需重复权限验证

## 权限配置说明

### 权限类型

1. **角色权限** (`roles`)
   - admin: 系统管理员
   - hr: 人力资源
   - interviewer: 面试官
   - user: 普通用户

2. **权限码** (`permissions`)
   - 格式: `resource:action`
   - 例如: `user:read`, `post:create`, `interview:update`

3. **部门权限** (`department`)
   - 需要用户属于至少一个部门
   - 用于数据隔离场景

### 配置优先级

- 如果同时配置了角色和权限码，用户必须同时满足
- 如果配置了部门权限，用户必须属于至少一个部门
- 公开路径无需任何权限

## 优势

1. **集中管理**: 所有权限配置集中在Gateway
2. **性能优化**: 避免重复的权限查询
3. **安全性**: 在入口处统一验证权限
4. **可维护性**: 权限规则清晰可见
5. **灵活性**: 支持多种权限控制方式

## 调试和监控

### 日志记录

- 所有权限检查都有详细日志
- 权限拒绝时记录具体原因
- 支持用户ID追踪

### 调试接口

- `/api/auth/permissions/my-access`: 查看当前用户权限
- `/api/auth/permissions/check`: 测试特定路径权限

## 注意事项

1. **权限配置更新**: 修改权限配置后需要重启Gateway
2. **路径匹配**: 使用正则表达式匹配，支持参数化路径
3. **性能考虑**: 权限检查在内存中进行，性能优秀
4. **安全性**: 敏感操作建议配置严格的权限要求

## 后续扩展

1. **动态权限配置**: 支持从数据库加载权限配置
2. **权限缓存**: 添加Redis缓存提升性能
3. **审计日志**: 记录所有权限操作日志
4. **权限测试**: 添加权限配置的自动化测试
