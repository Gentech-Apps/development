export class MenuModel {
  id: number = 0;
  name: string = '';
  icon: string = '';
  access: string = 'NA';
  children: MenuModel[] = [];
}
