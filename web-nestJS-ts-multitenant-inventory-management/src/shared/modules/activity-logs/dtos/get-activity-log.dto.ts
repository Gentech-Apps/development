import { IntersectionType, PickType } from '@nestjs/swagger';
import { UnifiedPipeModel } from '../../../models/unified-pipe.model';

export class GetActivityLogDto extends IntersectionType(
  PickType(UnifiedPipeModel, ['id', 'tenantId']),
) {}
