import { MessageTemplateRequest } from '../../core/request/message-template-request';

export class AddMessageTemplateToDrive {
  contentList: MessageTemplateRequest[] = [];
  driveId: number = 0;
  edit: boolean = false;
  groupId: number = 0;
  groupName: string = '';
}
