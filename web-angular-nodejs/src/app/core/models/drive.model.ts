import { AreaModel } from './area.model';

export class DriveModel {
  id: number = 0;
  name: string = '';
  status: string = '';
  userRegistrationStatus: string = '';
  walkIn: boolean = false;
  registrationType: string = '';
  loginType: string = '';
  registrationIP: string = '';
  loginIP: string = '';
  driveDate: string = '';
  agoraStatus: string = '';
  startTime: string | null = '';
  endTime: string | null = '';
  registrationCriteria: number = 0;
  formFields: string = '';
  completed: boolean = false;
  countAssociation: number = 0;
  areaOfInterestList: AreaModel[] = [];
  checked: boolean = false;
  timeSlots: string[] | undefined;
  qualifications: any[] = [];
  waitingTimeForPaperListPage: number = 0;
  waitingTimeForInstructionsPage: number = 0;

  constructor() {}
}
