// 由 fetch 封装统一的 restful 请求方法

import type { ApiResponse } from "@recruitment/schema";

interface FetchOptions {
  url: string;
  params?: Record<string, any>;
  config?: RequestInit;
}

async function fetchRequest<T>({
  url,
  params = {},
  config = {},
}: FetchOptions): Promise<ApiResponse<T>> {
  try {
    // 构建完整的 URL
    const queryString = Object.keys(params).length
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              acc[key] = value != null ? String(value) : "";
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()
      : "";
    const fullUrl = "/api" + url + queryString;

    // 检查并合并配置
    const finalConfig = {
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
    };

    // 发送请求
    const response = await fetch(fullUrl, finalConfig);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据
    return await response.json();
  } catch (error) {
    // 统一错误处理
    console.error("Fetch error:", error);
    throw error;
  }
}

function get<T>(
  url: string,
  params?: Record<string, any>,
  config?: RequestInit
) {
  return fetchRequest<T>({ url, params, config: { ...config, method: "GET" } });
}

function post<T>(url: string, body?: any, config?: RequestInit) {
  return fetchRequest<T>({
    url,
    config: { ...config, method: "POST", body: JSON.stringify(body) },
  });
}

function put<T>(url: string, body?: any, config?: RequestInit) {
  return fetchRequest<T>({
    url,
    config: { ...config, method: "PUT", body: JSON.stringify(body) },
  });
}

function del<T>(url: string, config?: RequestInit) {
  return fetchRequest<T>({ url, config: { ...config, method: "DELETE" } });
}

export { get, post, put, del };
