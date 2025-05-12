import { IntersectionType } from '@nestjs/swagger';
import { UnifiedApiPaginationDto } from '../../../shared/dto/unified-pagination.dto';
import { UnifiedApiFilterDto } from '../../../shared/dto/unified-api-filter.dto';

export class ListTenantsQueryDto extends IntersectionType(
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
) {}
