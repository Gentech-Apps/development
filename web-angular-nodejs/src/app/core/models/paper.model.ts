export class PaperModel {
  id: number = 0;
  areaOfInterestID: number = 0;
  message: string = '';
  name: string = '';
  paperTypeID: number = 0;
  priority: number = 0;
  showDeleteIcon: number = 0;
  totalQuestionCount: number = 0;
  totalTime: number = 0;
  paperCompilerType: string = '';

  //extra properties ...............

  checked: boolean = false;
  unchecked: boolean = false;
  qualified: boolean = false;
  disqualified: boolean = false;
  qualifiedByAdmin: boolean = false;
  disqualifiedByAdmin: boolean = false;
  autoDisqualified: boolean = false;
  showPaperStatus: boolean = false;
  showResultStatus: boolean = false;
  compilerType: boolean = false;
  paperStatus: boolean = false;

  constructor() {}
}
