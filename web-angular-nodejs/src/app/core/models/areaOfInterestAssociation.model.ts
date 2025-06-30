import { DriveAoiStageAssociation } from '../../interviewer/models/drive-aoi-stage-association.model';

export class AreaOfInterestAssociationModel {
  areaOfInterestId: number = 0;
  driveId: number = 0;
  status: string = '';
  driveAoiStageAssoicationList: DriveAoiStageAssociation[] = [];

  constructor() {}
}
