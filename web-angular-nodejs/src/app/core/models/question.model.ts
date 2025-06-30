export class QuestionModel {
  id?: number = 0;
  categoryId: number = 0;
  answer: number = 0;
  question: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  levelOfDifficulty: number = 0;
  ansModel: string = '';
  selected?: boolean = false;
}
