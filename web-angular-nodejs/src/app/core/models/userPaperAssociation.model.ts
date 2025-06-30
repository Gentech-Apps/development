export class UserPaperAssociationModel {
  id: number = 0;
  userId: number = 0;
  paperId: number = 0;
  correct: number = 0;
  inCorrect: number = 0;
  marks: number = 0;
  status: string = '';
  resultStatus: string = '';
  mailStatus: string = '';
  finalResult: string = '';
  dateOfRegistration: string = '';
  paperTypeId: number = 0;
  paperName: string = '';
  dateOfExam: string = '';
  priority: number = 0;
  isContent: boolean = false;
}
