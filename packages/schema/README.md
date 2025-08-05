# @recruitment/schema

招聘系统的 Zod 校验 schema 包，为前后端提供统一的类型定义和数据校验。

## 📦 功能特性

- ✅ 完整的 TypeScript 类型支持
- ✅ 统一的数据校验规则
- ✅ 前后端共享
- ✅ 模块化设计
- ✅ Tree-shaking 友好

## 🚀 快速开始

### 安装

```bash
pnpm add @recruitment/schema
```

### 使用示例

```typescript
// 全量导入
import {
  LoginRequestSchema,
  CreateCandidateRequestSchema,
} from "@recruitment/schema";

// 按模块导入
import { LoginRequestSchema } from "@recruitment/schema/auth";
import { CreateCandidateRequestSchema } from "@recruitment/schema/candidate";

// 类型导入
import type { LoginRequest, CreateCandidateRequest } from "@recruitment/schema";
```

// 候选人管理
import { CreateCandidateRequestSchema } from '@recruitment/schema/candidate';

// 面试管理
import { CreateInterviewRequestSchema } from '@recruitment/schema/interview';

````

## Schema 模块

### 1. 通用 Schema (`common`)
- 分页参数
- 通用响应格式
- 枚举类型定义
- 基础数据类型校验

### 2. 认证 Schema (`auth`)
- 登录/注册
- 密码重置
- Token 刷新
- 邮箱激活

### 3. 用户管理 Schema (`user`)
- 用户 CRUD 操作
- 批量导入用户
- 角色分配
- 用户导出

### 4. 部门管理 Schema (`department`)
- 部门 CRUD 操作
- 部门树形结构
- 部门移动
- 批量导入部门

### 5. 角色权限 Schema (`role`)
- 角色管理
- 权限分配
- 菜单权限
- 权限申请审批

### 6. 岗位管理 Schema (`post`)
- 岗位 CRUD 操作
- 岗位状态变更
- 岗位统计
- 批量导入岗位

### 7. 候选人管理 Schema (`candidate`)
- 候选人 CRUD 操作
- 候选人状态流转
- 批量导入候选人
- 候选人搜索和统计

### 8. 部门评定 Schema (`assessment`)
- 评定 CRUD 操作
- 批量评定
- 评定模板配置
- 评定统计

### 9. 面试管理 Schema (`interview`)
- 面试 CRUD 操作
- 面试反馈提交
- 面试日程安排
- 面试统计

### 10. 通知 Schema (`notification`)
- 通知发送
- 通知模板
- 通知设置
- 批量操作

### 11. 文件管理 Schema (`file`)
- 文件上传
- 文件分享
- 文件预览
- 文件统计

### 12. 系统管理 Schema (`system`)
- 系统配置
- 操作日志
- 数据导出
- 系统健康检查

## 使用示例

### 前端表单校验

```typescript
import { CreateCandidateRequestSchema } from '@recruitment/schema/candidate';
import { z } from 'zod';

// React Hook Form 示例
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<z.infer<typeof CreateCandidateRequestSchema>>({
  resolver: zodResolver(CreateCandidateRequestSchema)
});

const onSubmit = (data: z.infer<typeof CreateCandidateRequestSchema>) => {
  // 提交数据
};
````

### 后端接口校验

```typescript
import { CreateCandidateRequestSchema } from '@recruitment/schema/candidate';

// NestJS 示例
@Post('/candidates')
async createCandidate(
  @Body(new ZodValidationPipe(CreateCandidateRequestSchema))
  body: CreateCandidateRequest
) {
  return this.candidateService.create(body);
}

// Express 示例
app.post('/api/candidates', validate(CreateCandidateRequestSchema), (req, res) => {
  // 处理请求
});
```

### API 响应校验

```typescript
import { GetCandidatesResponseSchema } from "@recruitment/schema/candidate";

// 校验 API 响应
const response = await fetch("/api/candidates");
const data = await response.json();

const validatedData = GetCandidatesResponseSchema.parse(data);
```

## 类型提取

所有 schema 都导出了对应的 TypeScript 类型：

```typescript
import type {
  CreateCandidateRequest,
  CreateCandidateResponse,
  GetCandidatesRequest,
} from "@recruitment/schema/candidate";

// 或者手动提取
import { CreateCandidateRequestSchema } from "@recruitment/schema/candidate";
type CreateCandidateRequest = z.infer<typeof CreateCandidateRequestSchema>;
```

## 校验规则

### 通用规则

- UUID 格式校验
- 邮箱格式校验
- 手机号格式校验（中国大陆）
- 密码强度校验（至少6位，包含大小写字母和数字）
- 分页参数校验

### 业务规则

- 用户名长度限制（3-20位，只允许字母数字下划线）
- 工号格式校验（字母数字组合）
- 部门层级限制
- 文件大小限制
- 批量操作数量限制

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 监听模式构建
pnpm build:watch

# 类型检查
pnpm type-check
```

## 注意事项

1. **版本同步**: 确保前后端使用相同版本的 schema 包
2. **错误处理**: 合理处理 Zod 校验错误，提供友好的错误提示
3. **性能考虑**: 大型对象校验可能影响性能，考虑使用 `.partial()` 进行部分校验
4. **扩展性**: 使用 `.extend()` 方法扩展现有 schema，而不是重新定义

## 贡献

1. 新增 schema 时请同时更新类型导出
2. 确保校验规则符合业务需求
3. 添加适当的错误提示信息
4. 更新相关文档
