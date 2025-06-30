import { DisplayCategoryModel } from './displayCategory.model';

export class PaperTemplateModel {
  id: number = 0;
  paperId: number = 0;
  paperName: string = '';
  paperTypeId: number = 0;
  areaOfInterestName: string = '';
  categories: DisplayCategoryModel[] = [];
  paperCompilerType: string = '';
}
