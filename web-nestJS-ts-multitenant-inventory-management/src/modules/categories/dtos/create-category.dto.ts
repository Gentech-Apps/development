import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsMongoId, IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { Category } from '../schema/category.schema';

export class CreateCategoryDto extends PickType(Category, [
  'tenantId',
  'nameLocale',
  'parentCategoryId',
  'categoryImage',
]) {
  @ApiProperty({
    description:
      'Category name in primary language as per the tenant configs (i.e. default English)',
    type: 'string',
    example: 'Lunch',
  })
  @Matches(/^[a-zA-Z0-9\s\-\&\.\']*$/, {
    message: "Invalid Category name, Only letters, numbers, spaces, &, -, ., and ' are allowed",
  })
  @MaxLength(120, { message: 'Category name must be shorter than or equal to 120 characters' })
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @ApiProperty({
    description: 'The ID of the user who modified the record',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Last modified id should be valid' })
  @IsNotEmpty({ message: 'Last modified id is required' })
  lastModifiedBy: string;
}
