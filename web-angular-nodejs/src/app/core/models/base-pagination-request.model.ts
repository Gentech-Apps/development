import { PageConstant } from '../constants.ts/file-constants';

export class BasePaginationRequest {
  page: number = PageConstant.pageNumber;
  size: number = PageConstant.pageSize;
}
