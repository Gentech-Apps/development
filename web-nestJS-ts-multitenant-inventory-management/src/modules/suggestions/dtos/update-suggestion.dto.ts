import { PickType } from '@nestjs/swagger';
import { Suggestion } from '../schema/suggestion.schema';

export class UpdateSuggestionDto extends PickType(Suggestion, [
  'description',
  'tenantId',
  'title',
  'userId',
  'isActive',
  'isDeleted',
]) {}
