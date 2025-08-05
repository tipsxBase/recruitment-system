# Zod 验证集成指南

## 🎯 **为什么移除 ValidationPipe**

原因：

- `ValidationPipe` 是为 `class-validator` 设计的
- 您的项目使用 `Zod` 进行数据验证
- 需要自定义管道来支持 Zod

## 🔧 **Zod 验证管道使用方法**

### 1. **路由级别验证** (推荐)

```typescript
import { ZodValidation } from "../common/pipes/zod-validation.pipe";
import { loginSchema, registerSchema } from "@recruitment/schema";

@Controller("auth")
export class AuthController {
  @Post("login")
  @UsePipes(ZodValidation(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    // loginDto 已经通过 Zod 验证和转换
    return this.authService.login(loginDto);
  }

  @Post("register")
  @UsePipes(ZodValidation(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

### 2. **参数级别验证**

```typescript
@Post('login')
async login(
  @Body(ZodValidation(loginSchema)) loginDto: LoginDto
) {
  return this.authService.login(loginDto);
}
```

### 3. **查询参数验证**

```typescript
const querySchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
});

@Get('users')
async getUsers(
  @Query(ZodValidation(querySchema)) query: { page: number; limit: number }
) {
  return this.userService.findAll(query);
}
```

## 📋 **错误处理示例**

### 验证失败时的响应：

```json
{
  "statusCode": 400,
  "message": "数据验证失败",
  "errors": ["email: 请输入正确的邮箱地址", "password: 密码至少6位"]
}
```

## 🚀 **完整示例**

### Schema 定义 (packages/schema/src/auth.schema.ts)

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入正确的邮箱地址"),
  password: z.string().min(6, "密码至少6位"),
});

export type LoginDto = z.infer<typeof loginSchema>;
```

### 控制器使用

```typescript
@Controller("auth")
export class AuthController {
  @Post("login")
  @UsePipes(ZodValidation(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    // 类型安全 + 运行时验证
    return this.authService.login(loginDto);
  }
}
```

## ✅ **优势**

1. **类型安全**: TypeScript + Zod 双重保证
2. **共享验证**: 前后端使用相同的 Schema
3. **灵活性**: 可以在不同层级应用验证
4. **错误友好**: 清晰的错误信息

## 🔄 **迁移建议**

1. 移除全局 `ValidationPipe`
2. 为每个需要验证的路由添加 `@UsePipes(ZodValidation(schema))`
3. 确保所有 Schema 都在 `@recruitment/schema` 包中定义
4. 测试验证是否正常工作

这样就能完美集成 Zod 验证了！
