import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { AuditLogsService } from '../modules/audit-logs/audit-logs.service';
import { map, Observable } from 'rxjs';
import { getMatchingEntity } from '../utils/get-matching-entity';
import { HttpMethods } from '../enums/http-methods.enum';
import { CreateAuditLogDto } from '../modules/audit-logs/dto/create-audit-log.dto';
import { generateResponseMessage } from '../utils/generate-response-message';

//Audit log interceptor is not in use
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const { method: action } = request;
    const msg = generateResponseMessage(action);
    const message = `Record ${msg} sucessfully.`;
    const user = request.user;
    const ipAddress = request.ip;
    const entity = getMatchingEntity(request.route.path);
    const userId = user?.user_id;
    const tenantId = user?.tenant_id;

    return next.handle().pipe(
      map(async (data) => {
        const response = await data;

        if ([HttpMethods.PATCH, HttpMethods.POST, HttpMethods.DELETE].includes(action)) {
          const auditLogData: CreateAuditLogDto = {
            tenantId,
            userId,
            entity,
            action,
            documentId: response.data?._id,
            modifiedData: response.data,
            message: typeof data === 'string' ? data : message,
            statusCode,
            ipAddress,
          };
          await this.auditLogsService.createOneAuditLog(auditLogData);

          Logger.log(
            JSON.stringify({
              message: `Request Success(${statusCode}): ${auditLogData.message} | Path: ${request.method} ${request?.url}`,
              statusCode: statusCode,
              timestamp: new Date().toISOString(),
              resource: AuditLogInterceptor.name,
            }),
          );
        }

        return data;
      }),
    );
  }
}
