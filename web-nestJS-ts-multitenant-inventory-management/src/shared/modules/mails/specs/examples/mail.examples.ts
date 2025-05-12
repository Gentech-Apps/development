import { EmailTemplateTypeEnum } from '../../../../enums/template.enum';

export const MailExamples = {
  sendEmail: {
    ok: {
      body: {
        username: 'Alan',
        to: ['test@example.com'],
        emailTemplateType: EmailTemplateTypeEnum.REGISTER,
        subject: 'Sample OTP Email',
        html: '<p>Your OTP is 123456</p>',
      },
      expected: {
        output: {
          messageId: 'mockMessageId',
          accepted: ['test@example.com'],
        },
      },
    },
    badRequest: {
      body: {
        to: [],
      },
    },
    missingEmailContent: {
      body: {
        username: 'Alan',
        to: ['test@example.com'],
        subject: 'Sample OTP Email',
        emailTemplateType: EmailTemplateTypeEnum.REGISTER,
      },
    },
    error: {
      body: {
        username: 'Alan',
        to: ['test@example.com'],
        subject: 'Sample OTP Email',
      },
      expectedError: new Error('Email service error'),
    },
  },
  sendWithAttachment: {
    ok: {
      body: {
        username: 'Alan',
        to: ['test@example.com'],
        subject: 'Sample OTP Email',
        emailTemplateType: EmailTemplateTypeEnum.REGISTER,
        html: '<p>Your OTP is 123456</p>',
      },
      files: [
        {
          fieldname: 'files',
          originalname: 'testfile.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          size: 1024,
          buffer: Buffer.from('test content'),
          stream: null as any,
          destination: '',
          filename: '',
          path: '',
        },
      ],
      expected: {
        output: {
          messageId: 'mockMessageId',
          accepted: ['test@example.com'],
          attachments: [
            {
              filename: 'testfile.txt',
              content: Buffer.from('test content'),
            },
          ],
        },
      },
    },
  },
};
