import { PickType } from '@nestjs/swagger';
import { Category } from '../schema/category.schema';

export class UpdateCategoryDto extends PickType(Category, [
  'name',
  'nameLocale',
  'parentCategoryId',
  'tenantId',
  'lastModifiedBy',
  'categoryImage',
  'isActive',
  'isDeleted',
]) {}
