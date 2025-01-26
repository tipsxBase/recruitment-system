export interface PaginationResult<T> {
  pageIndex: number;
  pageSize: number;
  total: number;
  records: T[];
}

export interface MenuEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  key: string;
  path: string | null;
  name: string;
  parentId: number | null;
  children: MenuEntity[];
}

export interface RecruitmentResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface RecruitmentPaginationResponse<T> {
  code: number;
  message: string;
  data: PaginationResult<T>;
}

export * from "./user.interface";
