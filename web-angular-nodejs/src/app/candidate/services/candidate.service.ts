import { Injectable } from '@angular/core';
import { UpdateAgoraStatusRequest } from '../../core/models/updateagora-request.model';
import { SuspectedDuplicateUserRequest } from '../../core/models/suspected-duplicate-request.model';
import { UserModel } from '../../core/models/user.model';
import { ApiService } from '../../core/services/api.service';
import { DuplicateUserRequest } from '../models/duplicate-user-request';
import { ResendLoginCredentialsRequest } from '../models/resend-login-credentials-request.model';
import { GeneratePasswordModel } from '../../auth/models/generatePassword.model';
import { AdminAddUserModel } from '../models/admin-add-user.model';
import { FilteredUserRequest } from '../../core/request/filtered-user-request';
import { FilteredSelectionRequest } from '../../core/request/filtered-selection-request';
import { UpdateSelectedUserRequest } from '../../core/request/update-selected-user-request';
import { AdminUpdateUserModel } from '../models/admin-update-user.model';

@Injectable()
export class CandidateService extends ApiService {
  getAllActiveUser(request: FilteredUserRequest) {
    return this.request({
      path: 'recruitment/users/getAllActiveUsers',
      method: 'POST',
      body: request,
    });
  }

  getCandidatePageDetails() {
    return this.request({
      path: 'recruitment/users/getCandidatePageDetails',
      method: 'GET',
    });
  }

  generatePassword(user: GeneratePasswordModel) {
    return this.request({
      path: 'users/generateExamineePassword',
      method: 'POST',
      body: user,
    });
  }

  addUser(user: AdminAddUserModel) {
    return this.request({
      path: 'recruitment/users/add',
      method: 'POST',
      body: user,
    });
  }

  updateUser(user: AdminUpdateUserModel) {
    return this.request({
      path: 'recruitment/users/updateUser',
      method: 'PUT',
      body: user,
    });
  }

  getAreaOfInterestByDriveId(idList: number[]) {
    return this.request({
      path: 'recruitment/getAreaOfInterestByDriveList',
      method: 'POST',
      body: idList,
    });
  }

  getUserProfileImage(userId: number, referral: boolean) {
    return this.request({
      path: 'users/profileImage/' + userId + '/' + referral,
      method: 'GET',
    });
  }

  getUserResume(userId: number, referral: boolean) {
    return this.request({
      path: 'users/resume/' + userId + '/' + referral,
      method: 'GET',
    });
  }

  adminInactivateUsers(request: UpdateSelectedUserRequest) {
    return this.request({
      path: 'recruitment/users/inactivate',
      method: 'POST',
      body: request,
    });
  }

  adminUpdateAgoraStatus(request: UpdateAgoraStatusRequest) {
    return this.request({
      path: 'recruitment/users/updateAgorastatus',
      method: 'POST',
      body: request,
    });
  }

  importUsers(data: FormData) {
    return this.request({
      path: 'recruitment/users/importUsers',
      method: 'POST',
      multipart: true,
      body: data,
    });
  }

  sendRegistrationMail() {
    return this.request({
      path: 'recruitment/users/registrationMail',
      method: 'POST',
    });
  }

  getAllAreas() {
    return this.request({
      path: 'recruitment/users/getAllAreasOfInterest',
      method: 'GET',
    });
  }

  getAllDuplicateUserList(request: DuplicateUserRequest) {
    return this.request({
      path: 'recruitment/users/duplicateUsersList',
      method: 'POST',
      body: request,
    });
  }

  getPossibleDuplicateUserList(request: SuspectedDuplicateUserRequest) {
    return this.request({
      path: 'recruitment/users/getSuspectDuplicateExaminee',
      method: 'POST',
      body: request,
    });
  }

  getSuspectDuplicatePowerUsers(user: UserModel) {
    return this.request({
      path: 'recruitment/users/getSuspectDuplicatePowerUsers',
      method: 'POST',
      body: user,
    });
  }

  resendLoginCreadentials(request: ResendLoginCredentialsRequest) {
    return this.request({
      path: `recruitment/users/resendLoginCredentials`,
      method: 'POST',
      body: request,
    });
  }

  getExportUsersList(request: FilteredSelectionRequest) {
    return this.request({
      path: 'recruitment/users/exportUsersList',
      method: 'POST',
      body: request,
    });
  }

  getCurrentDateTime() {
    return this.request({
      path: 'recruitment/users/getCurrentDateAndTime',
      method: 'GET',
    });
  }
}
