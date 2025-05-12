import { ApiProperty, PickType } from '@nestjs/swagger';
import { MaxLength, IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Suggestion } from '../schema/suggestion.schema';

export class CreateSuggestionDto extends PickType(Suggestion, ['tenantId']) {
  @ApiProperty({
    description: 'The title of the suggestion',
    example: 'New snack suggestion',
  })
  @MaxLength(120, { message: 'Title must be shorter than or equal to 120 characters' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'The description of the suggestion',
    example: 'We should add new items for snacks because current items are widespread.',
  })
  @MaxLength(1000, { message: 'Description must be shorter than or equal to 1000 characters' })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'The ID of the user associated with suggestion',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'User id should be valid' })
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;
}
