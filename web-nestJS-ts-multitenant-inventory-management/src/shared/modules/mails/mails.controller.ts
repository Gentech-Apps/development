// import { Body, Controller, HttpCode, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { MailsService } from './mails.service';
// import { VerificationEmailRequestDto } from './dtos/mail.dto';
// import { FilesInterceptor } from '@nestjs/platform-express';

// @Controller('mails')
// export class MailsController {
//   constructor(private readonly messengerService: MailsService) {}

//   @HttpCode(200)
//   @Post('send-otp')
//   @UseInterceptors(FilesInterceptor('files'))
//   sendOTP(
//     @Body() body: VerificationEmailRequestDto,
//     @UploadedFiles() files: Express.Multer.File[],
//   ) {
//     return this.messengerService.sendOTPEmail(body, files);
//   }
// }
