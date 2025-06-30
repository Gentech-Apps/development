import { DisplayEmailTemplateModel } from './displayEmailTemplate.model';

export class EmailGroupWithTemplateModel {
  id: number = 0;
  name: string = '';
  emailTemplateList: DisplayEmailTemplateModel[] = [];
}
