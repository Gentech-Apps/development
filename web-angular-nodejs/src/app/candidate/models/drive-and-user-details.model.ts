import { UserModel } from '../../core/models/user.model';
import { DriveModel } from '../../core/models/drive.model';

export class DriveAndUserDetailsModel {
  driveData: DriveModel = new DriveModel();
  driveList: DriveModel[] = [];
  userData: UserModel = new UserModel();
  edit: boolean = false;
}
