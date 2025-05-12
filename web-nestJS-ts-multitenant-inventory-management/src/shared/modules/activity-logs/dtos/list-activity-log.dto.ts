import { IntersectionType } from '@nestjs/swagger';
import { UnifiedApiFilterDto } from '../../../dto/unified-api-filter.dto';
import { UnifiedApiPaginationDto } from '../../../dto/unified-pagination.dto';

export class ListActivityLogsQueryDto extends IntersectionType(
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
) {}
