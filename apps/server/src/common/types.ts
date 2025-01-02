export interface PaginationResult<T> {
  page: number;
  pageSize: number;
  total: number;
  records: T[];
}
