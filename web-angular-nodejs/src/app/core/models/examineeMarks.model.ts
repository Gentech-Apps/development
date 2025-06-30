import { UserPaperAssociationModel } from './userPaperAssociation.model';

export class ExamineeMarksModel {
  userId: number = 0;
  name: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  mobileNumber: string = '';
  examDate: string = '';
  examStartTime: string = '';
  examEndTime: string = '';
  finalResult: string = '';
  finalMailStatus: string = '';
  driveName: string = '';
  driveId: number = 0;
  areaOfIntrestId: number = 0;
  areaOfInterestName: string = '';
  updateAreaOfIntrestId: number = 0;
  updateAreaOfInterestName: string = '';
  userPaperAssociationList: UserPaperAssociationModel[] = [];
  duplicateUser: number = 0;
  qualification: string = '';

  //extra properties
  paper1Name: string = '';
  paper1Marks: number = 0;
  paper1Status: string = '';
  paper2Name: string = '';
  paper2Marks: number = 0;
  paper2Status: string = '';
  paper3Name: string = '';
  paper3Marks: number = 0;
  paper3Status: string = '';
}
