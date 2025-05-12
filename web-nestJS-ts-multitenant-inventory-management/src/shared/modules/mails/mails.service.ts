import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { compile } from 'handlebars';
import { promises as fsPromises } from 'fs';
import { isMissing } from '../../utils/typecheck';
import { EmailRequestDto } from './dtos/mail.dto';

@Injectable()
export class MailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}
  async sendEmail(data: Partial<EmailRequestDto>, files?: Express.Multer.File[]) {
    try {
      const response = (await this.#triggerEmail({
        data,
        hbsTemplatePath: `/templates/${data.emailTemplateType}.hbs`,
        fileAttached: files
          ? files.map((file) => ({
              filename: file.originalname,
              content: file.buffer,
            }))
          : undefined,
      })) as Record<string, unknown>;

      if (isMissing(response.messageId) && isMissing(response?.accepted)) {
        this.logger.verbose(
          JSON.stringify({
            context: `Failed to sending email`,
            message: JSON.stringify(response),
            resource: MailsService.name,
          }),
        );
        return false;
      }
      this.logger.log(
        JSON.stringify({
          context: `Success to sending email`,
          message: JSON.stringify(response),
          resource: MailsService.name,
        }),
      );
      return true;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Error in sending email operation:',
          message: error.message,
          resource: MailsService.name,
        }),
      );
      throw error;
    }
  }

  async #triggerEmail({
    data,
    hbsTemplatePath,
    fileAttached,
  }: {
    data: Partial<EmailRequestDto>;
    hbsTemplatePath: string;
    fileAttached?: { filename: string; content: Buffer }[];
  }) {
    try {
      const response = (await this.mailerService.sendMail({
        to: data?.to,
        subject: data?.subject,
        attachments: fileAttached,
        html: await this.#hbsCompiler(hbsTemplatePath, data?.content),
        cc: data?.cc,
        bcc: data?.bcc,
      })) as Record<string, unknown>;
      return response;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Error in sending email:',
          message: error.message,
          resource: MailsService.name,
        }),
      );
      throw error;
    }
  }

  async #hbsCompiler(templatePath: string, content: Record<string, unknown>): Promise<string> {
    try {
      const htmlContent = await fsPromises.readFile(__dirname + templatePath, {
        encoding: 'utf8',
      });
      if (!htmlContent) {
        this.logger.verbose(
          JSON.stringify({
            context: `htmlContent: ${htmlContent}`,
            message: 'Failed to read the template file.',
            resource: MailsService.name,
          }),
        );
        throw new NotFoundException('Failed to read the template file');
      }
      const template = compile(htmlContent);
      if (!template) {
        this.logger.verbose(
          JSON.stringify({
            context: `template: ${template}`,
            message: 'Failed to compile the template.',
            resource: MailsService.name,
          }),
        );
        throw new NotFoundException('Failed to compile the template');
      }
      return template(content);
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Failed to read the template file:',
          message: error.message,
          resource: MailsService.name,
        }),
      );
      throw error;
    }
  }
}
