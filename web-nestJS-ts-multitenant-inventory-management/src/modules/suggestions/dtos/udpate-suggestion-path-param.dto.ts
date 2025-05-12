import { IntersectionType, PickType } from '@nestjs/swagger';
import { UnifiedPipeModel } from '../../../shared/models/unified-pipe.model';

export class UpdateSuggestionPathParamDto extends IntersectionType(
  PickType(UnifiedPipeModel, ['id', 'tenantId']),
) {}
