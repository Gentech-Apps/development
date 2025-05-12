import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from '../mails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailRequestDto } from '../dtos/mail.dto';
import { MailExamples } from './examples/mail.examples';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';

describe('#Mails.MailsService', () => {
  let mailsService: MailsService;
  let mailerService: MailerService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: vi.fn().mockResolvedValue({
              messageId: 'mockMessageId',
              accepted: ['test@example.com'],
            }),
          },
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    mailsService = module.get<MailsService>(MailsService);
    mailerService = module.get<MailerService>(MailerService);
    logger = module.get<Logger>(Logger);
  });

  describe('.sendEmail', () => {
    it('should send email successfully', async () => {
      const dto: EmailRequestDto = MailExamples.sendEmail.ok.body;

      const result = await mailsService.sendEmail(dto);

      expect(result).toBe(true);
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: dto.to,
          subject: dto.subject,
        }),
      );
    });

    it('should throw an error for missing email content', async () => {
      const dto: Partial<EmailRequestDto> = MailExamples.sendEmail.missingEmailContent.body;

      try {
        await mailsService.sendEmail(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid email addresses provided');
      }
    });

    it('should handle email sending errors', async () => {
      vi.spyOn(mailerService, 'sendMail').mockRejectedValue(
        MailExamples.sendEmail.error.expectedError,
      );

      const dto: EmailRequestDto = MailExamples.sendEmail.ok.body;

      try {
        await mailsService.sendEmail(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(MailExamples.sendEmail.error.expectedError.message);
      }
    });

    it('should send email with attachment', async () => {
      const dto = MailExamples.sendWithAttachment.ok.body;
      const files = MailExamples.sendWithAttachment.ok.files;

      await mailsService.sendEmail(dto, files);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: [
            {
              filename: 'testfile.txt',
              content: Buffer.from('test content'),
            },
          ],
        }),
      );
    });
  });
});
