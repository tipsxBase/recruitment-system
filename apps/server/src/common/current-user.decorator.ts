import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { get } from '@recruitment/shared';

function getValueFromRequestHeaders<T>(request: any, key: string): T | null {
  const value = get(request, key);
  try {
    return value ? (JSON.parse(value) as T) : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return value as T;
  }
}

export interface User {
  id: string;
  role: string;
  permissions: string[];
  email: string;
  departments: string[];
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 用户信息存储在 headers 中 从 headers 获取用户信息
    console.log('=== CURRENT USER DEBUG ===');
    console.log('Request headers:', request.headers);
    console.log('=== END CURRENT USER DEBUG ===');
    const userId = getValueFromRequestHeaders(request.headers, 'x-user-id');
    const userRole = getValueFromRequestHeaders(
      request.headers,
      'x-user-roles',
    );
    const userPermissions = getValueFromRequestHeaders(
      request.headers,
      'x-user-permissions',
    );
    const userEmail = getValueFromRequestHeaders(
      request.headers,
      'x-user-email',
    );
    const userDepartments = getValueFromRequestHeaders(
      request.headers,
      'x-user-departments',
    );

    return {
      id: userId,
      role: userRole,
      permissions: userPermissions,
      email: userEmail,
      departments: userDepartments,
    };
  },
);
