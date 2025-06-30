import { ObjectiveAnswer } from './objectiveAnswer';
import { OptionModel } from './option.mode';

export class QuestionListModel {
  id: number = 0;
  categoryId: number = 0;
  categoryName: string = '';
  question: string = '';
  levelOfDifficulty: number = 0;
  answer: string = '';
  testAreaValue: string = '';
  ansModel: string = '';
  optionList: OptionModel[] = [];
  state: string = '';
  status: string = '';
  subjectiveAnswer: string = '';
  compilerType: string = '';
  enabled: boolean = false;
  answerData: ObjectiveAnswer = new ObjectiveAnswer();
}
