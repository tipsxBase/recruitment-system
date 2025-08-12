## Prisma

1. 生成迁移文件

```bash
pnpm dlx prisma migrate dev --name <migration_name>
```

- --name <migration_name> 是迁移的名称，用于描述这次变更的内容（例如 add_user_table）。
- 此命令会：
  检测模型的变更。
  生成迁移文件（位于 prisma/migrations 文件夹）。
  自动将迁移应用到数据库。

2. 部署迁移到生产环境

在生产环境中部署迁移时，使用以下命令：

```bash
pnpm dlx prisma migrate deploy
```

此命令会依次运行 prisma/migrations 文件夹中的所有迁移

3. 同步 Prisma Client

每次迁移后，需要更新 Prisma Client：

```bash
pnpm dlx prisma generate
```

4. npx prisma db push

仅同步数据结构，不需要生成迁移文件

5. npx prisma migrate dev --create-only

仅生成 SQL，不对数据库进行变更
