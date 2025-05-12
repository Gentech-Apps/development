import { IntersectionType, PickType } from '@nestjs/swagger';
import { UnifiedPipeModel } from '../../../shared/models/unified-pipe.model';

export class UpdateCategoryPathParamDto extends IntersectionType(
  PickType(UnifiedPipeModel, ['id', 'tenantId']),
) {}
