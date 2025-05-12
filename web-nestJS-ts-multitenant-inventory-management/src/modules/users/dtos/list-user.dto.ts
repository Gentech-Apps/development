import { IntersectionType, PickType } from '@nestjs/swagger';
import { UnifiedApiFilterDto } from '../../../shared/dto/unified-api-filter.dto';
import { UnifiedApiPaginationDto } from '../../../shared/dto/unified-pagination.dto';
import { User } from '../schema/user.schema';
import { UnifiedApiStageDto } from '../../../shared/dto/unified-api-stage.dto';

export class ListUsersQueryDto extends IntersectionType(
  PickType(User, ['roleId']),
  UnifiedApiFilterDto,
  UnifiedApiPaginationDto,
  UnifiedApiStageDto,
) {}
