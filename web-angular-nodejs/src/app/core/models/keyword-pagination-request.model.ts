import { BasePaginationRequest } from './base-pagination-request.model';

export class KeywordPaginationRequest extends BasePaginationRequest {
  keyword: string = '';
}
