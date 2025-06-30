export class EmailTemplateModel {
  id: number = 0;
  type: string = '';
  name: string = '';
  subject: string = '';
  content: string = '';
  templateAdded: boolean = false;
  isEdit: boolean = false;
}
