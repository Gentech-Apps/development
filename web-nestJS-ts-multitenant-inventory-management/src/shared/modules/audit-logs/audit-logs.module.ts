import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { RolesModule } from '../../../modules/roles/roles.module';
import { UsersModule } from '../../../modules/users/users.module';
import { ApiKeysModule } from '../../../modules/api-keys/api-keys.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schema/audit-log.schema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    forwardRef(() => ApiKeysModule),
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, Logger],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
