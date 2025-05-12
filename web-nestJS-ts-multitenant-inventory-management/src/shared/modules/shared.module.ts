import { Module } from '@nestjs/common';
import { MailsModule } from './mails/mails.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [MailsModule, FilesModule, AuthModule, AuditLogsModule],
})
export class SharedModule {}
