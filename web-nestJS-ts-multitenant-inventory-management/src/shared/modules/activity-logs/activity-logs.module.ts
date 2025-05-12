import { forwardRef, Logger, Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLog, ActivityLogSchema } from './schema/activity-log.schema';
import { ApiKeysModule } from '../../../modules/api-keys/api-keys.module';
import { RolesModule } from '../../../modules/roles/roles.module';
import { UsersModule } from '../../../modules/users/users.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ApiKeysModule),
    forwardRef(() => AuditLogsModule),
    MongooseModule.forFeature([{ name: ActivityLog.name, schema: ActivityLogSchema }]),
  ],
  providers: [ActivityLogsService, Logger],
  controllers: [ActivityLogsController],
})
export class ActivityLogsModule {}
