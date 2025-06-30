export interface IApiRequest {
  keyword: string | number | undefined;
  page: number;
  size: number;
  userId?: number;
  sortBy?: string;
  order?: string;
}
