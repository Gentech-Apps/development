import { RegistrationTypeOptions } from '../../core/utils/constants';
import { GenericSelectionRequest } from '../../core/models/generic-selection-request.model';

export class ResendLoginCredentialsRequest extends GenericSelectionRequest {
  registrationType = RegistrationTypeOptions.All;
  status = '';
}
