import { DriveModel } from './drive.model';

export class ReferralModel {
  drives: ReferralModel[] = [];
  element: DriveModel = new DriveModel();
  edit: boolean = true;
  referral: boolean = true;
}
