import { Qualification } from 'src/app/add-drive/models/qualification.model';

export class AddQualificationToDriveRequest {
  driveId: number = 0;
  qualifications: number[] = [];
}
