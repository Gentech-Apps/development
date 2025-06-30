import { FilterObject } from 'src/app/examinee-marks/models/filter-object.model';
import { UpdateAOIRequest } from './updateAOIRequest';

export class BulkUpdateRequest {
  updateAOIRequest: UpdateAOIRequest | undefined;
  filterObject: FilterObject | undefined;
}
