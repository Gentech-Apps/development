export class RolesModel {
  id?: number = 0;
  role: string = '';
  permissions: PermissionsModel[] = [];
  isDeleted?: number = 0;
  isDefault?: number = 0;
  created_at?: string | Date = '';

  constructor() {}
}

export class PermissionsModel {
  id: number = 0;
  name: string = '';
  icon: string = '';
  access: string = '';
  children: PermissionsModel[] = [];
  url?: string;
  constructor() {}
}
