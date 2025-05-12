import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../../modules/users/users.module';
import { TenantsOperationService } from '../../../modules/tenants/tenants.operation.service';
import { RolesModule } from '../../../modules/roles/roles.module';
import { MailsService } from '../mails/mails.service';
import { TenantsModule } from '../../../modules/tenants/tenants.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    TenantsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret_key'),
        signOptions: {
          expiresIn: parseInt(configService.getOrThrow<string>('jwt.expiration_duration')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, MailsService, TenantsOperationService, Logger],
})
export class AuthModule {}
