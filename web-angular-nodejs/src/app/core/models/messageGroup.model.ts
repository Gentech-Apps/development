import { MessageTemplateContentModel } from './messageTemplateContent.model';

export class MessageGroupModel {
  id: number = 0;
  name: string = '';
  messageContentList: MessageTemplateContentModel[] = [];
}
