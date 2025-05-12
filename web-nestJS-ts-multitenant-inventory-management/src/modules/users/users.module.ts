import { forwardRef, Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RolesModule } from '../roles/roles.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { AuditLogsModule } from '../../shared/modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => AuditLogsModule),
    forwardRef(() => ApiKeysModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, Logger],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
