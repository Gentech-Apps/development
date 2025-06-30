import { ExamTypes } from '../enums/examTypes';

export class GenericSelectionRequest {
  allSelected: boolean = false;
  driveId: number = 0;
  areaOfInterestId: number = 0;
  examType: ExamTypes = ExamTypes.ALL_EXAM_DATES;
  fromDate: string = '';
  toDate: string = '';
  keyword: string = '';
  includedIdList: number[] = [];
  notIncludedIdList: number[] = [];
}
