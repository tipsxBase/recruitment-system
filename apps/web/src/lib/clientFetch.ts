// 请求工具 (httpRequest.ts)
"use client";
import { toast } from "@/hooks/use-toast";

// 定义请求的 headers 类型
interface RequestHeaders {
  [key: string]: string;
}

// 定义请求体的类型
interface RequestBody {
  [key: string]: any;
}

// 通用的 fetch 请求方法
const request = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: RequestBody | null = null,
  headers: RequestHeaders = {}
): Promise<any> => {
  try {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "请求失败",
        description: data.message,
      });
      return Promise.reject(data);
    }

    return data;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "请求失败",
      description: error as any,
    });
  }
};

// 构建 URL 查询参数
const buildQueryParams = (
  params: Record<string, string | number | boolean | undefined>
): string => {
  if (!params || Object.keys(params).length === 0) return "";
  return "?" + new URLSearchParams(params as Record<string, string>).toString();
};

// GET 请求方法
export const getRequest = (
  url: string,
  params: Record<string, any> = {},
  headers: RequestHeaders = {}
): Promise<any> => {
  const queryString = buildQueryParams(params);
  return request(url + queryString, "GET", null, headers);
};

// POST 请求方法
export const postRequest = (
  url: string,
  body: RequestBody,
  headers: RequestHeaders = {}
): Promise<any> => {
  return request(url, "POST", body, headers);
};

// PUT 请求方法
export const putRequest = (
  url: string,
  body: RequestBody,
  headers: RequestHeaders = {}
): Promise<any> => {
  return request(url, "PUT", body, headers);
};

// DELETE 请求方法
export const deleteRequest = (
  url: string,
  params: Record<string, any> = {},
  body: RequestBody | null = null,
  headers: RequestHeaders = {}
): Promise<any> => {
  // 如果有查询参数，拼接到 URL 后面
  const queryString = buildQueryParams(params);
  // 如果请求体参数存在，就使用请求体
  return request(url + queryString, "DELETE", body, headers);
};
