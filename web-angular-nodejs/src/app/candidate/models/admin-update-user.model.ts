import { AdminAddUserModel } from './admin-add-user.model';

export class AdminUpdateUserModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  mobileNumber: string = '';
  areaOfInterestId: number = 0;
  driveId: number = 0;
  currentDate: boolean = false;
  examDate: string = '';
  examStartTime: string = '';
  editedbyAdmin: boolean = false;

  constructor(adminAddUserModel: AdminAddUserModel) {
    this.id = adminAddUserModel.id;
    this.firstName = adminAddUserModel.firstName;
    this.lastName = adminAddUserModel.lastName;
    this.mobileNumber = adminAddUserModel.mobileNumber;
    this.areaOfInterestId = adminAddUserModel.areaOfInterestId;
    this.driveId = adminAddUserModel.driveId;
    this.currentDate = adminAddUserModel.currentDate;
    this.examDate = adminAddUserModel.examDate;
    this.examStartTime = adminAddUserModel.examStartTime;
    this.editedbyAdmin = adminAddUserModel.editedbyAdmin;
  }
}
