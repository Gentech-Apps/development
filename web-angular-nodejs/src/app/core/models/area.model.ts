import { PaperModel } from './paper.model';
import { DriveAoiStageAssociation } from '../../interviewer/models/drive-aoi-stage-association.model';

export class AreaModel {
  id: number = 0;
  name: string = '';
  paperList: PaperModel[] = [];
  countAoiAssociation: number = 0;
  countAoiWithPapersAssociation: number = 0;
  driveAoiStatus: string = '';
  checked: boolean = false;
  driveAoiStageAssoicationList: DriveAoiStageAssociation[] = [];

  constructor() {}
}
