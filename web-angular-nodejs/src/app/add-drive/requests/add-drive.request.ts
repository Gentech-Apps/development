import { DriveModel } from '../../core/models/drive.model';

export class AddDriveRequest {
  id: number;
  name: string;
  registrationType: string;
  loginType: string;
  registrationIP: string;
  loginIP: string;
  driveDate: string;
  agoraStatus: string;
  startTime: string | null;
  endTime: string | null;
  registrationCriteria: number;
  waitingTimeForPaperListPage: number;
  waitingTimeForInstructionsPage: number;
  timeSlots: number[] | undefined;
  constructor(drive: DriveModel) {
    this.id = drive.id;
    this.name = drive.name;
    this.registrationType = drive.registrationType;
    this.loginType = drive.loginType;
    this.registrationIP = drive.registrationIP;
    this.loginIP = drive.loginIP;
    this.driveDate = drive.driveDate;
    this.agoraStatus = drive.agoraStatus;
    this.startTime = drive.startTime;
    this.endTime = drive.endTime;
    this.registrationCriteria = Number(drive.registrationCriteria) ?? 0;
    this.waitingTimeForInstructionsPage = drive.waitingTimeForInstructionsPage;
    this.waitingTimeForPaperListPage = drive.waitingTimeForPaperListPage;
    this.timeSlots = drive.timeSlots?.map((slot) => Number(slot)) ?? [];
  }
}
