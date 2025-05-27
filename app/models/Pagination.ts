export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const paginationDefault: Pagination = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 0,
  totalItems: 0,
};
