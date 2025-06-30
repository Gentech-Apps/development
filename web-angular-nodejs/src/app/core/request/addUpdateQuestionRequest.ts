import { QuestionModel } from '../models/question.model';

export class AddUpdateQuestionRequest {
  id?: number = 0;
  categoryId: number = 0;
  answer: number = 0;
  question: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  ansModel: string = '';

  constructor(request: QuestionModel) {
    this.id = request.id;
    this.categoryId = request.categoryId;
    this.answer = request.answer;
    this.question = request.question;
    this.option1 = request.option1;
    this.option2 = request.option2;
    this.option3 = request.option3;
    this.option4 = request.option4;
    this.ansModel = request.ansModel;
  }
}
