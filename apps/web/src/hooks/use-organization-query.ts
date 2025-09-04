import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationApi } from "@/service/organization";
import type {
  GetOrganizationsRequest,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  InviteUserRequest,
  RespondInvitationRequest,
  GetInvitationsRequest,
} from "@recruitment/schema";
import { toast } from "sonner";

/**
 * 组织管理相关的 Query Keys
 *
 * 查询键的层次结构：
 * - ['organizations'] - 所有组织相关的查询
 * - ['organizations', 'list', params] - 组织列表查询，带参数
 * - ['organizations', 'detail', id] - 单个组织详情查询
 * - ['organizations', 'invitations', params] - 邀请列表查询
 */
export const organizationKeys = {
  /**
   * 所有组织相关查询的根键
   */
  all: ["organizations"] as const,

  /**
   * 组织列表查询键
   * @param params - 查询参数
   */
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params: GetOrganizationsRequest) =>
    [...organizationKeys.lists(), params] as const,

  /**
   * 组织详情查询键
   * @param id - 组织ID
   */
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,

  /**
   * 邀请相关查询键
   */
  invitations: () => [...organizationKeys.all, "invitations"] as const,
  invitation: (params: GetInvitationsRequest) =>
    [...organizationKeys.invitations(), params] as const,
};

/**
 * 获取组织列表的 Query Hook
 *
 * 功能：
 * - 自动缓存查询结果
 * - 支持参数变化时自动重新查询
 * - 提供 loading、error、data 状态
 * - 支持手动刷新
 *
 * @param params - 查询参数，包含分页、搜索等
 * @param options - 可选的查询配置
 */
export function useOrganizations(
  params: GetOrganizationsRequest,
  options?: {
    enabled?: boolean; // 是否启用查询，默认 true
    staleTime?: number; // 数据过期时间
    refetchInterval?: number; // 自动刷新间隔
  }
) {
  return useQuery({
    // 查询键，参数变化时会自动重新查询
    queryKey: organizationKeys.list(params),

    // 查询函数，实际的 API 调用
    queryFn: async () => {
      const response = await organizationApi.getOrganizations(params);
      if (!response.data) {
        throw new Error("获取组织列表失败");
      }
      return response.data;
    },

    // 查询配置
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
    refetchInterval: options?.refetchInterval,

    // 错误处理
    retry: (failureCount, error) => {
      // 如果是 4xx 错误，不重试
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      // 最多重试 3 次
      return failureCount < 3;
    },

    // 重试延迟（指数退避）
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 获取单个组织详情的 Query Hook
 *
 * @param id - 组织ID
 * @param options - 可选的查询配置
 */
export function useOrganization(
  id: string,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: async () => {
      const response = await organizationApi.getOrganization(id);
      if (!response.data) {
        throw new Error("获取组织详情失败");
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!id, // 只有在有 ID 的情况下才启用查询
  });
}

/**
 * 创建组织的 Mutation Hook
 *
 * 功能：
 * - 处理创建组织的异步操作
 * - 自动更新相关查询缓存
 * - 提供成功/失败的 Toast 提示
 * - 提供 loading 状态
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    // 变更函数，实际的 API 调用
    mutationFn: async (data: CreateOrganizationRequest) => {
      const response = await organizationApi.createOrganization(data);
      if (!response.data) {
        throw new Error("创建组织失败");
      }
      return response.data;
    },

    // 成功回调
    onSuccess: () => {
      // 显示成功提示
      toast.success("组织创建成功");

      // 使所有组织列表查询失效，触发重新获取
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      // 可选：直接更新缓存而不是重新获取
      // 注意：这里不设置详情缓存，因为创建响应可能不包含完整的组织信息
    },

    // 失败回调
    onError: (error) => {
      console.error("创建组织失败:", error);
      toast.error(
        error instanceof Error ? error.message : "创建组织失败，请重试"
      );
    },
  });
}

/**
 * 更新组织的 Mutation Hook
 *
 * @param options - 可选的配置项
 */
export function useUpdateOrganization(options?: {
  onSuccess?: () => void; // 简化回调，不传递具体数据
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationRequest;
    }) => {
      const response = await organizationApi.updateOrganization(id, data);
      if (!response.data) {
        throw new Error("更新组织失败");
      }
      return response.data;
    },

    onSuccess: (_, variables) => {
      toast.success("组织更新成功");

      // 更新组织详情缓存（如果API返回完整数据）
      // queryClient.setQueryData(
      //   organizationKeys.detail(variables.id),
      //   updatedOrganization
      // )

      // 使组织列表查询失效
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      // 使组织详情查询失效
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });

      // 调用自定义成功回调
      options?.onSuccess?.();
    },

    onError: (error) => {
      console.error("更新组织失败:", error);
      const errorMessage =
        error instanceof Error ? error.message : "更新组织失败，请重试";
      toast.error(errorMessage);

      // 调用自定义错误回调
      options?.onError?.(
        error instanceof Error ? error : new Error(errorMessage)
      );
    },
  });
}

/**
 * 删除组织的 Mutation Hook
 *
 * @param options - 可选的配置项
 */
export function useDeleteOrganization(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await organizationApi.deleteOrganization(id);
      return response;
    },

    onSuccess: (_, deletedId) => {
      toast.success("组织删除成功");

      // 从组织详情缓存中移除
      queryClient.removeQueries({
        queryKey: organizationKeys.detail(deletedId),
      });

      // 使组织列表查询失效
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      // 调用自定义成功回调
      options?.onSuccess?.();
    },

    onError: (error) => {
      console.error("删除组织失败:", error);
      const errorMessage =
        error instanceof Error ? error.message : "删除组织失败，请重试";
      toast.error(errorMessage);

      // 调用自定义错误回调
      options?.onError?.(
        error instanceof Error ? error : new Error(errorMessage)
      );
    },
  });
}

/**
 * 邀请用户到组织的 Mutation Hook
 */
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      data,
    }: {
      orgId: string;
      data: InviteUserRequest;
    }) => {
      const response = await organizationApi.inviteUser(orgId, data);
      if (!response.data) {
        throw new Error("邀请用户失败");
      }
      return response.data;
    },

    onSuccess: () => {
      toast.success("邀请发送成功");

      // 使邀请列表查询失效
      queryClient.invalidateQueries({
        queryKey: organizationKeys.invitations(),
      });
    },

    onError: (error) => {
      console.error("邀请用户失败:", error);
      toast.error(
        error instanceof Error ? error.message : "邀请用户失败，请重试"
      );
    },
  });
}

/**
 * 响应组织邀请的 Mutation Hook
 */
export function useRespondInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      data,
    }: {
      invitationId: string;
      data: RespondInvitationRequest;
    }) => {
      const response = await organizationApi.respondInvitation(
        invitationId,
        data
      );
      return response;
    },

    onSuccess: (_, variables) => {
      const action = variables.data.action === "ACCEPT" ? "接受" : "拒绝";
      toast.success(`${action}邀请成功`);

      // 使相关查询失效
      queryClient.invalidateQueries({
        queryKey: organizationKeys.invitations(),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });
    },

    onError: (error) => {
      console.error("响应邀请失败:", error);
      toast.error(error instanceof Error ? error.message : "操作失败，请重试");
    },
  });
}

/**
 * 获取邀请列表的 Query Hook
 *
 * @param params - 查询参数
 */
export function useInvitations(params: GetInvitationsRequest) {
  return useQuery({
    queryKey: organizationKeys.invitation(params),
    queryFn: async () => {
      const response = await organizationApi.getInvitations(params);
      if (!response.data) {
        throw new Error("获取邀请列表失败");
      }
      return response.data;
    },
  });
}

/**
 * 预取组织详情的工具函数
 *
 * 用于在用户可能查看组织详情之前预先加载数据，提升用户体验
 *
 * @param id - 组织ID
 */
export function usePrefetchOrganization() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: organizationKeys.detail(id),
      queryFn: async () => {
        const response = await organizationApi.getOrganization(id);
        if (!response.data) {
          throw new Error("获取组织详情失败");
        }
        return response.data;
      },
      // 预取的数据5分钟后过期
      staleTime: 5 * 60 * 1000,
    });
  };
}
