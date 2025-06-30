import { GenericSearchRequest } from './generic-search-request';

export class GetAllInActiveUserRequest extends GenericSearchRequest {
  status: string = '';
  driveId: number = 0;
  areaOfInterestId: number = 0;
  fromDate: string = '';
  toDate: string = '';
}
