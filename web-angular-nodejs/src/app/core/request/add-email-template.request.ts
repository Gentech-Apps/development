import { EmailTemplateContentRequest } from './email-template-content-request';

export class AddEmailTemplateRequest {
  contentList: EmailTemplateContentRequest[] = [];
  driveId: number = 0;
  edit: boolean = false;
  groupId: number = 0;
  groupName: string = '';
}
