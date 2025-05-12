import { forwardRef, Logger, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './schema/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schema/user.schema';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { AuditLogsModule } from '../../shared/modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ApiKeysModule),
    forwardRef(() => AuditLogsModule),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RolesService, Logger],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
