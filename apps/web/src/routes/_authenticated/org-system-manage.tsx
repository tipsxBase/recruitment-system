import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationRequestSchema,
  UpdateOrganizationRequestSchema,
} from "@recruitment/schema";
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from "@recruitment/schema";
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from "@/hooks/use-organization-query";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { organizationColumns } from "@/components/data-table/organization-columns";

export const Route = createFileRoute("/_authenticated/org-system-manage")({
  component: OrganizationManagement,
});

/**
 * 组织管理页面组件
 *
 * 功能特性：
 * - 使用 React Query 进行数据管理，自动缓存和同步
 * - 采用 shadcn-admin 风格的数据表格
 * - 支持搜索、分页、排序、过滤等表格功能
 * - 集成 shadcn UI 组件，提供统一的设计风格
 * - 响应式设计，适配各种屏幕尺寸
 * - 完整的 CRUD 操作：创建、读取、更新、删除组织
 * - 乐观更新和错误处理
 */
function OrganizationManagement() {
  // ==================== 状态管理 ====================

  // 搜索和分页状态
  const [currentPage] = useState(1);
  const pageSize = 10;

  // 弹窗状态
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);

  // ==================== API 查询和变更 ====================

  // 查询参数 - 使用 useMemo 避免不必要的重新渲染
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      pageSize,
    }),
    [currentPage, pageSize]
  );

  // 获取组织列表 - React Query 自动处理缓存和同步
  const {
    data: organizationData,
    isLoading,
    error,
    refetch,
  } = useOrganizations(queryParams);

  // 变更操作 hooks
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();

  // ==================== 表单管理 ====================

  // 创建组织表单
  const createForm = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(CreateOrganizationRequestSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  // 编辑组织表单
  const editForm = useForm<UpdateOrganizationRequest>({
    resolver: zodResolver(UpdateOrganizationRequestSchema),
    defaultValues: {
      name: "",
      code: "",
      status: "ACTIVE",
    },
  });

  // ==================== 事件处理函数 ====================

  /**
   * 处理编辑组织
   * 使用 useCallback 避免不必要的重新渲染
   */
  const handleEdit = useCallback(
    (organization: Organization) => {
      setEditingOrganization(organization);
      editForm.reset({
        name: organization.name,
        code: organization.code || "",
        status: organization.status,
      });
      setIsEditDialogOpen(true);
    },
    [editForm]
  );

  /**
   * 处理删除组织
   * 包含确认对话框和错误处理
   */
  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("确定要删除这个组织吗？此操作不可恢复。")) {
        try {
          await deleteOrganizationMutation.mutateAsync(id);
        } catch (error) {
          // 错误已在 mutation 中处理
          console.error("删除失败:", error);
        }
      }
    },
    [deleteOrganizationMutation]
  );

  // ==================== 表格配置 ====================

  /**
   * 表格列配置
   * 使用 useMemo 优化性能，避免不必要的重新计算
   */
  const columns = useMemo(
    () => organizationColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  /**
   * 状态过滤选项
   */
  const statusOptions = [
    {
      label: "启用",
      value: "ACTIVE",
    },
    {
      label: "禁用",
      value: "DISABLED",
    },
  ];

  // ==================== 表单提交处理 ====================

  /**
   * 处理创建组织表单提交
   */
  const handleCreateSubmit = useCallback(
    async (data: CreateOrganizationRequest) => {
      try {
        await createOrganizationMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
        createForm.reset();
      } catch (error) {
        // 错误已在 mutation 中处理
        console.error("创建失败:", error);
      }
    },
    [createOrganizationMutation, createForm]
  );

  /**
   * 处理更新组织表单提交
   */
  const handleUpdateSubmit = useCallback(
    async (data: UpdateOrganizationRequest) => {
      if (!editingOrganization) return;

      try {
        await updateOrganizationMutation.mutateAsync({
          id: editingOrganization.id,
          data,
        });
        setIsEditDialogOpen(false);
        setEditingOrganization(null);
        editForm.reset();
      } catch (error) {
        // 错误已在 mutation 中处理
        console.error("更新失败:", error);
      }
    },
    [editingOrganization, updateOrganizationMutation, editForm]
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 创建组织按钮 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            创建组织
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>创建新组织</DialogTitle>
            <DialogDescription>
              填写以下信息创建一个新的组织。所有标记为 * 的字段都是必填项。
            </DialogDescription>
          </DialogHeader>

          {/* 创建组织表单 */}
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>组织名称 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入组织名称"
                        {...field}
                        disabled={createOrganizationMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>组织编码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入组织编码"
                        {...field}
                        disabled={createOrganizationMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      组织的唯一标识码，用于系统内部识别，可选填
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createOrganizationMutation.isPending}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={createOrganizationMutation.isPending}
                >
                  {createOrganizationMutation.isPending ? "创建中..." : "创建"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={organizationData?.organizations || []}
        searchKey="name"
        searchPlaceholder="搜索组织名称..."
        facetedFilters={[
          {
            column: "status",
            title: "状态",
            options: statusOptions,
          },
        ]}
      />

      {/* 编辑组织对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>编辑组织</DialogTitle>
            <DialogDescription>
              修改组织信息。更改将立即保存并生效。
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>组织名称 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入组织名称"
                        {...field}
                        disabled={updateOrganizationMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>组织编码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入组织编码"
                        {...field}
                        disabled={updateOrganizationMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      组织的唯一标识码，用于系统内部识别
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={updateOrganizationMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择组织状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">启用</SelectItem>
                        <SelectItem value="DISABLED">禁用</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      禁用的组织将无法进行正常业务操作
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateOrganizationMutation.isPending}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={updateOrganizationMutation.isPending}
                >
                  {updateOrganizationMutation.isPending ? "保存中..." : "保存"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
