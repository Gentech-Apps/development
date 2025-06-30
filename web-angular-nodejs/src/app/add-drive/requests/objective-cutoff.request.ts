import { CutoffModel } from '../../drive-setup/models/cutOffModel';

export class AddObjectiveCutoffRequest {
  areaOfInterestId: number;
  autoCutOffMarks: number;
  cutoffMarks: number;
  paperId: number;
  constructor(cutOffModel: CutoffModel) {
    this.areaOfInterestId = Number(cutOffModel.areaOfInterestId);
    this.autoCutOffMarks = Number(cutOffModel.autoCutOffMarks);
    this.cutoffMarks = Number(cutOffModel.cutoffMarks);
    this.paperId = Number(cutOffModel.paperId);
  }
}
