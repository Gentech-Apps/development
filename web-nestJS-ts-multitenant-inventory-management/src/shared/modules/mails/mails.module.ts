import { Logger, Module } from '@nestjs/common';
import { MailsService } from './mails.service';
// import { MailsController } from './mails.controller';

@Module({
  // controllers: [MailsController],
  providers: [MailsService, Logger],
  exports: [MailsService],
})
export class MailsModule {}
