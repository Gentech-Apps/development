import { PickType } from '@nestjs/swagger';
import { AuditLog } from '../schema/audit-log.schema';

export class CreateAuditLogDto extends PickType(AuditLog, [
  'tenantId',
  'userId',
  'entity',
  'action',
  'documentId',
  'modifiedData',
  'message',
  'statusCode',
  'ipAddress',
]) {}
