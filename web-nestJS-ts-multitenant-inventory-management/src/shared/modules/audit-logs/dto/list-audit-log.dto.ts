import { IntersectionType } from '@nestjs/swagger';
import { UnifiedApiFilterDto } from '../../../dto/unified-api-filter.dto';
import { UnifiedApiPaginationDto } from '../../../dto/unified-pagination.dto';
import { UnifiedApiStageDto } from '../../../dto/unified-api-stage.dto';

export class ListAuditLogsQueryDto extends IntersectionType(
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
  UnifiedApiStageDto,
) {}
