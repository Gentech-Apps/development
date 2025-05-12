import { IntersectionType, PickType } from '@nestjs/swagger';
import { UnifiedApiFilterDto } from '../../../shared/dto/unified-api-filter.dto';
import { UnifiedApiPaginationDto } from '../../../shared/dto/unified-pagination.dto';
import { UnifiedApiStageDto } from '../../../shared/dto/unified-api-stage.dto';
import { Role } from '../schema/role.schema';

export class ListRolesQueryDto extends IntersectionType(
  PickType(Role, ['name']),
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
  UnifiedApiStageDto,
) {}
