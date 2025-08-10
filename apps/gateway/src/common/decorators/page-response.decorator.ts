import { SetMetadata } from "@nestjs/common";

export const PAGE_RESPONSE_KEY = "usePageResponse";

/**
 * RawResponse 装饰器，用于标记某个接口需要使用原始响应对象
 * @returns
 */
export const PageResponse = () => SetMetadata(PAGE_RESPONSE_KEY, true);
