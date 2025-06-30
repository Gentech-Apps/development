import { ExamTypes } from '../enums/examTypes';

export class CandidateListRequest {
  driveId: number = 0;
  areaOfInterestId: number = 0;
  examType: ExamTypes = ExamTypes.ALL_EXAM_DATES;
  keyword: string = '';
  page: number = 0;
  size: number = 0;
  fromDate: string = '';
  toDate: string = '';
  status: string = '';
  sortBy: string = '';
  order: string = '';
  registrationType: string = '';
}
