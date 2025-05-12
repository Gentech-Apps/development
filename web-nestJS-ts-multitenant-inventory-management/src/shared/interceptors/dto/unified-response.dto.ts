import { UnifiedListQueryResponseDto } from '../../dto/unified-list-query-response.dto';
import { isUnifiedListQueryResponseDto } from '../../utils/typecheck';

export class UnifiedApiResponseModel<T> {
  data: T | T[] | undefined;
  statusCode: number;
  metadata?: {
    next: string | null;
    prev: string | null;
    totalCount?: number;
  };
  message: string;
  timestamp: string;

  constructor(data: UnifiedListQueryResponseDto<T> | T, statusCode: number, message: string) {
    if (isUnifiedListQueryResponseDto(data)) {
      this.data = data.data;
      this.metadata = {
        totalCount: data.totalCount,
        next: data.next,
        prev: data.prev,
      };
    } else {
      if (typeof data !== 'string') {
        this.data = data;
      }
    }

    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
