export type Pagination = {
  page: number;
  perPage: number;
}

export type PaginatedUrlPayload<T> = Partial<T> & {
  page?: number;
  perPage?: number;
  userId?: string;
};

export type PaginatedUrlResult = {
  results: any;
  total: number;
  page: number | null;
  perPage: number | null;
};