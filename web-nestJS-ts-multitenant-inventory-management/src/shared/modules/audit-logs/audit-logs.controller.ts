import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { ApiControllerTag, ApiTypeTag } from '../../../swagger/tags';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesAndPermissionGuard } from '../../guards/roles-and-permission.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { toTitleCase } from '../../utils/string-operations';
import { ApiXCreateResponses, ApiXListResponses } from '../../decorators/swagger/swagger';
import { AuditLog } from './schema/audit-log.schema';
import { UnifiedListQueryResponseDto } from '../../dto/unified-list-query-response.dto';
import { ListAuditLogsQueryDto } from './dto/list-audit-log.dto';

@ApiTags(toTitleCase(ApiControllerTag.AuditLogs))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.AuditLogs)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @ApiExcludeEndpoint()
  @ApiXCreateResponses({
    operationId: 'create_an_audit_log',
    summary: 'Create an audit log',
    type: AuditLog,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneAuditLog(@Body() createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogsService.createOneAuditLog(createAuditLogDto);
  }

  @ApiExcludeEndpoint()
  @ApiXListResponses({
    operationId: 'list_audit_logs',
    summary: 'List Audit logs',
    type: [AuditLog],
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllAuditLogs(
    @Query() query: ListAuditLogsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<AuditLog>> {
    return this.auditLogsService.findAllAuditLogs(query);
  }
}
