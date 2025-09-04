import { useState, useEffect, useCallback } from "react";
import { organizationApi } from "@/service/organization";
import type {
  GetOrganizationsRequest,
  GetOrganizationsResponse,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  InviteUserRequest,
  RespondInvitationRequest,
  GetInvitationsRequest,
  Organization,
} from "@recruitment/schema";
import { toast } from "sonner";

/**
 * 组织管理相关的自定义 hooks
 */

/**
 * 获取组织列表
 */
export function useOrganizations(params: GetOrganizationsRequest) {
  const [data, setData] = useState<GetOrganizationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await organizationApi.getOrganizations(params);
      setData(response.data!);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params.page, params.pageSize, params.keyword]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOrganizations,
  };
}

/**
 * 获取组织详情
 */
export function useOrganization(id: string) {
  const [data, setData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await organizationApi.getOrganization(id);
      setData(response.data!);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOrganization,
  };
}

/**
 * 创建组织
 */
export function useCreateOrganization() {
  const [isLoading, setIsLoading] = useState(false);

  const createOrganization = async (data: CreateOrganizationRequest) => {
    try {
      setIsLoading(true);
      const response = await organizationApi.createOrganization(data);
      toast.success("组织创建成功");
      return response.data!;
    } catch (error: any) {
      toast.error(error?.message || "创建组织失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
  };
}

/**
 * 更新组织
 */
export function useUpdateOrganization() {
  const [isLoading, setIsLoading] = useState(false);

  const updateOrganization = async (
    id: string,
    data: UpdateOrganizationRequest
  ) => {
    try {
      setIsLoading(true);
      const response = await organizationApi.updateOrganization(id, data);
      toast.success("组织更新成功");
      return response.data!;
    } catch (error: any) {
      toast.error(error?.message || "更新组织失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateOrganization,
    isLoading,
  };
}

/**
 * 删除组织
 */
export function useDeleteOrganization() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteOrganization = async (id: string) => {
    try {
      setIsLoading(true);
      await organizationApi.deleteOrganization(id);
      toast.success("组织删除成功");
    } catch (error: any) {
      toast.error(error?.message || "删除组织失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteOrganization,
    isLoading,
  };
}

/**
 * 邀请用户加入组织
 */
export function useInviteUser() {
  const [isLoading, setIsLoading] = useState(false);

  const inviteUser = async (orgId: string, data: InviteUserRequest) => {
    try {
      setIsLoading(true);
      const response = await organizationApi.inviteUser(orgId, data);
      toast.success("邀请发送成功");
      return response.data!;
    } catch (error: any) {
      toast.error(error?.message || "发送邀请失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteUser,
    isLoading,
  };
}

/**
 * 响应组织邀请
 */
export function useRespondInvitation() {
  const [isLoading, setIsLoading] = useState(false);

  const respondInvitation = async (
    invitationId: string,
    data: RespondInvitationRequest
  ) => {
    try {
      setIsLoading(true);
      const response = await organizationApi.respondInvitation(
        invitationId,
        data
      );
      toast.success("邀请响应成功");
      return response.data!;
    } catch (error: any) {
      toast.error(error?.message || "响应邀请失败");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    respondInvitation,
    isLoading,
  };
}

/**
 * 获取邀请列表
 */
export function useInvitations(params: GetInvitationsRequest) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await organizationApi.getInvitations(params);
      setData(response.data!);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchInvitations,
  };
}
