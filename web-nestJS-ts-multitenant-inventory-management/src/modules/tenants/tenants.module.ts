import { forwardRef, Logger, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schema/tenant.schema';
import { ConfigService } from '@nestjs/config';
import { TenantsOperationService } from './tenants.operation.service';
import { MailsService } from '../../shared/modules/mails/mails.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../shared/modules/auth/strategies/jwt.strategy';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { AuditLogsModule } from '../../shared/modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    forwardRef(() => AuditLogsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ApiKeysModule),
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
  ],
  providers: [
    TenantsService,
    ConfigService,
    Logger,
    TenantsOperationService,
    MailsService,
    JwtService,
    JwtStrategy,
  ],
  controllers: [TenantsController],
  exports: [TenantsService, TenantsOperationService],
})
export class TenantsModule {}
