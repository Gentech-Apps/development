import { PermissionsModel } from '../models/role.model';

export class AddOrEditRoleRequest {
  id: number = 0;
  role: string = '';
  permissions: PermissionsModel[] = [];
  forceAdd: boolean = false;
}
