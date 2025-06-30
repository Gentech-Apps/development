import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordModel } from '../../core/models/changePassword.model';
import { UserModel } from '../../core/models/user.model';
import { ApiService } from '../../core/services/api.service';
import { UserWarningModel } from '../../core/models/userWarning.model';
import { LogoutModel } from '../models/logout.model';
import { ResetPassword } from '../models/resetPassword.model';
import { LoginModel } from '../models/login.model';
import { GeneratePasswordModel } from '../models/generatePassword.model';

@Injectable()
export class AuthService extends ApiService {
  public getRegistrationPageDetails(userIP: string) {
    return this.request({
      path: `users/getRegistrationPageDetails/` + userIP,
      method: 'GET',
    });
  }

  examineeEmailVerification(examineeData: GeneratePasswordModel) {
    return this.request({
      path: 'users/generateExamineePassword',
      method: 'POST',
      body: examineeData,
    });
  }

  registerUser(userObject: FormData) {
    return this.request({
      path: `users/registration`,
      method: 'POST',
      multipart: true,
      body: userObject,
    });
  }

  public loginUser(param: LoginModel): Observable<any> {
    return this.request({
      path: `users/login`,
      method: `POST`,
      body: param,
    });
  }

  public saveUserWarning(param: UserWarningModel): Observable<any> {
    return this.request({
      path: `users/addUserWarning`,
      method: `POST`,
      body: param,
    });
  }

  public updateAgoraId(param: { userId: number; data: any }): Observable<any> {
    return this.request({
      path: `recruitment/users/${param.userId}`,
      method: `POST`,
      body: param.data,
    });
  }

  public updateLoginStatusAndUserStatus(param: number): Observable<any> {
    return this.request({
      path: `recruitment/users/updateLoginAndUserStatus/${param}`,
      method: `POST`,
    });
  }

  getMessageContentByDriveIdAndTypeId(driveId: number, type: string) {
    return this.request({
      path: 'users/getMessageContentByDriveIdAndTypeId/' + driveId + '/' + type,
      method: 'GET',
    });
  }

  changePassword(chnagePasswordObj: ChangePasswordModel) {
    return this.request({
      path: `recruitment/users/changePassword`,
      method: `POST`,
      body: chnagePasswordObj,
    });
  }

  getInstructions(paperTypeId: number) {
    return this.request({
      path: `users/getInstructions/` + paperTypeId,
      method: `GET`,
    });
  }

  getAllQualificationsByDriveId(driveId: number) {
    return this.request({
      path: 'users/getAllQualificationsByDriveId/' + driveId,
      method: 'GET',
    });
  }

  logoutUser(logoutRequest: LogoutModel) {
    return this.request({
      path: `users/logout`,
      method: 'POST',
      body: logoutRequest,
    });
  }

  sendEmailForResetPassword(resetPasswordModel: ResetPassword) {
    return this.request({
      path: `users/send/resetPasswordMail`,
      method: 'POST',
      body: resetPasswordModel,
    });
  }

  resetPassword(user: UserModel) {
    return this.request({
      path: 'users/reset/password',
      method: 'POST',
      body: user,
    });
  }

  getUserDetails(userId: number) {
    return this.request({
      path: `users/detail/${userId}`,
      method: 'GET',
    });
  }

  getUserEmailByUserId() {
    return this.request({
      path: `recruitment/users/getUserEmailByUserId`,
      method: `GET`,
    });
  }
}
