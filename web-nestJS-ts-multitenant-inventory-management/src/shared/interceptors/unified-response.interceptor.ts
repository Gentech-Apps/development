import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnifiedApiResponseModel } from './dto/unified-response.dto';
import { isUnifiedListStructure } from '../utils/typecheck';
import { decodeCursor } from '../utils/decodeCursor';
import { UnifiedListQueryResponseDto } from '../dto/unified-list-query-response.dto';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../constants/pagination.constant';
import { CursorDto } from '../dto/unified-pagination.dto';
import { ActivityLogsService } from '../modules/activity-logs/activity-logs.service';
import { HttpMethods } from '../enums/http-methods.enum';
import { getMatchingEntity } from '../utils/get-matching-entity';
import { transformHeader } from '../utils/generate-encypted-string';

@Injectable()
export class UnifiedResponseInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const cursor = decodeCursor(request.query.cursor);
    const message = statusCode === 201 ? 'Record created sucessfully.' : `Operation sucessful.`;
    const { method, url, headers, body, query, params } = request;
    const user = request.user;
    const ipAddress = request.ip;
    const entity = getMatchingEntity(request.route.path);
    const userId = user?.user_id;
    const tenantId = user?.tenant_id;

    return next.handle().pipe(
      map(async (data) => {
        const logData = {
          tenantId,
          userId,
          method: HttpMethods[method as keyof typeof HttpMethods],
          entity,
          statusCode,
          body,
          headers: transformHeader(headers),
          query,
          param: params,
          path: url,
          ipAddress,
          message: typeof data === 'string' ? data : message,
        };

        await this.activityLogsService.createOneActivityLog(logData);

        Logger.log(
          JSON.stringify({
            message: `Request Success(${statusCode}): ${logData.message} | Path: ${request.method} ${request?.url}`,
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
            resource: UnifiedResponseInterceptor.name,
          }),
        );

        const transformedData = isUnifiedListStructure(data)
          ? this.transformResponse(data, cursor)
          : data;

        return new UnifiedApiResponseModel(transformedData, statusCode, logData.message);
      }),
    );
  }

  public transformResponse(
    result: UnifiedListQueryResponseDto<any>[],
    cursor: CursorDto,
  ): { data: []; totalCount: number; next: string | null; prev: string | null } {
    const totalCount = Array.isArray(result[0]?.totalCount)
      ? (result[0]?.totalCount[0]?.totalCount ?? 0)
      : (result[0]?.totalCount ?? 0);

    const data = result[0]?.data ?? [];

    // Helper to encode cursor as base64url
    const encodeCursor = (cursorObj: CursorDto): string =>
      Buffer.from(JSON.stringify(cursorObj), 'utf-8').toString('base64url');

    // Next cursor: only set if `data.length & default limit both are less than to totalCount & both are equals to each other` is less than `totalCount` (i.e., more pages exist)
    const nextCursor = { ...cursor, $skip: cursor.$skip + 1 };
    const nextCursorBase64 =
      data.length < totalCount && data.length == DEFAULT_LIMIT && DEFAULT_LIMIT < totalCount
        ? encodeCursor(nextCursor)
        : null;

    // Previous cursor: only set if `cursor.$skip` is greater than default skip (i.e., not on the first page)
    const prevCursor = { ...cursor, $skip: Math.max(0, cursor.$skip - 1) };
    const prevCursorBase64 = cursor.$skip > DEFAULT_SKIP ? encodeCursor(prevCursor) : null;

    return {
      data,
      totalCount,
      next: nextCursorBase64,
      prev: prevCursorBase64,
    };
  }
}
