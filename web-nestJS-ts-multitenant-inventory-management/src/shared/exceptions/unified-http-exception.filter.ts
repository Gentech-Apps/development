import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LogError, notMissing } from '../utils/typecheck';
import { ActivityLogsService } from '../modules/activity-logs/activity-logs.service';
import { HttpMethods } from '../enums/http-methods.enum';
import { getMatchingEntity } from '../utils/get-matching-entity';
import { transformHeader } from '../utils/generate-encypted-string';
import { GlobalExceptionResponseApiModel } from '../models/global-response-api.model';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const globalException = exception as LogError;

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = [globalException.response?.['message']].flat() ??
      [globalException.message].flat() ?? ['Internal Server Error'];

    const responseErrors = {
      ...(notMissing(globalException?.response?.['status'])
        ? { status: globalException.response?.['status'] as number }
        : {}),
      ...(notMissing(globalException?.response?.['data'])
        ? { data: globalException.response?.['data'] as string }
        : {}),
    };

    const responseBody: GlobalExceptionResponseApiModel = {
      message,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      ...responseErrors,
    };

    Logger.error(
      JSON.stringify({
        message: `Request Error(${httpStatus}): ${message} | Path: ${request.method} ${request?.url}`,
        context: {
          ...globalException.response,
          ...globalException.context,
        },
        exception: globalException,
        resource: GlobalExceptionFilter.name,
      }),
    );
    const logData = {
      tenantId: request.user?.tenant_id,
      userId: request.user?.user_id,
      method: HttpMethods[request.method as keyof typeof HttpMethods],
      entity: getMatchingEntity(request.route.path),
      statusCode: httpStatus,
      body: request.body,
      headers: transformHeader(request.headers),
      query: request.query,
      param: request.params,
      path: request.url,
      ipAddress: request.ip,
      message: message,
    };

    this.activityLogsService.createOneActivityLog(logData);

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
