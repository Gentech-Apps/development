import { QuestionListModel } from './question-list';

export class CategoryListModel {
  categoryId: number = 0;
  categoryName: string = '';
  toBeAttempted: number = 0;
  questionList: QuestionListModel[] = [];
  compilerType: string = '';

  //test variables...................
  showCategoryQuestions: boolean = false;
  enableCount: number = 0;
  lastActivatedQuestionId: number[] = [];
}
