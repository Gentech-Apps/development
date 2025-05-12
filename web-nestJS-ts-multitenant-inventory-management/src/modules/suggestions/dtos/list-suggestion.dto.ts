import { IntersectionType } from '@nestjs/swagger';
import { UnifiedApiFilterDto } from '../../../shared/dto/unified-api-filter.dto';
import { UnifiedApiPaginationDto } from '../../../shared/dto/unified-pagination.dto';

export class ListSuggestionsQueryDto extends IntersectionType(
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
) {}
