import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponseObject } from '../../core/interface/apiResponseObject';
import { AddFormfieldRequest } from '../../core/request/addFormFieldRequest';
import { AddQualificationToDriveRequest } from '../../core/request/addQualificationsToDriveRequest';
import { ApiService } from '../../core/services/api.service';
import { AddMessageTemplateToDrive } from '../models/add-message-template-to-drive.model';
import { AddDriveRequest } from '../requests/add-drive.request';
import { checkQuestionCountForAOIRequest } from '../requests/check-question-count.request';

@Injectable()
export class AddDriveService extends ApiService {
  public addDrive(driveObject: AddDriveRequest): Observable<APIResponseObject> {
    return this.request({
      path: `recruitment/drives/addDrive`,
      method: 'POST',
      body: driveObject,
    });
  }

  public addFormFields(param: AddFormfieldRequest): Observable<APIResponseObject> {
    return this.request({
      path: `recruitment/drives/addFormFieldsToDrive`,
      method: 'POST',
      body: param,
    });
  }

  public getEmailTemplateTypes(): Observable<any> {
    return this.request({
      path: `recruitment/drives/getEmailTemplateTypes`,
      method: 'GET',
    });
  }

  public saveEmailTemplates(param: any | null): Observable<any> {
    return this.request({
      path: `recruitment/drives/addEmailTemplatesToDrive`,
      method: 'POST',
      body: param,
    });
  }

  public getEmailTemplatesByGroupId(param: any | null): Observable<any> {
    return this.request({
      path: `recruitment/drives/getEmailTemplatesByGroupId?groupId=${param}`,
      method: 'GET',
    });
  }

  public getDefaultEmailTemplate(): Observable<any> {
    return this.request({
      path: `recruitment/drives/getDefaultEmailTemplate`,
      method: 'POST',
    });
  }

  public getAreaListForPaperCutOff(fromAddDrive: boolean) {
    return this.request({
      path: `recruitment/users/getAllAreasOfInterestHavingPaper/${fromAddDrive}`,
      method: 'GET',
    });
  }

  public getPaperByAreaOfInterestId(param: any | null): Observable<any> {
    return this.request({
      path: `recruitment/getPaperByAreaOfInterest/${param}`,
      method: 'GET',
    });
  }

  public getMessageTemplateTypes(): Observable<any> {
    return this.request({
      path: `recruitment/drives/getMessageTemplateTypes`,
      method: 'GET',
    });
  }

  public getMessageTemplatesByGroupId(id: number) {
    return this.request({
      path: 'recruitment/drives/getMessageTemplatesByGroupId/' + id,
      method: 'GET',
    });
  }

  public saveMessageTemplates(param: AddMessageTemplateToDrive): Observable<APIResponseObject> {
    return this.request({
      path: 'recruitment/drives/addMessageTemplatesToDrive',
      method: 'POST',
      body: param,
    });
  }

  public onFinalSubmitDrive(param: any | null): Observable<any> {
    return this.request({
      path: `recruitment/drives/onFinalSubmitDrive`,
      method: 'POST',
      body: param,
    });
  }

  public getAllTimeSlots(): Observable<APIResponseObject> {
    return this.request({
      path: `timeSlot/all`,
      method: 'GET',
    });
  }

  // Qualification api call
  public getAllQualification() {
    return this.request({
      path: 'recruitment/qualification/getAllQualificationsForDrive',
      method: 'GET',
      body: {},
    });
  }

  public saveQualificationForDrive(
    requestObj: AddQualificationToDriveRequest,
  ): Observable<APIResponseObject> {
    return this.request({
      path: `recruitment/qualification/saveQualificationForDrive`,
      method: 'POST',
      body: requestObj,
    });
  }

  checkQuestionCountForAOI(
    request: checkQuestionCountForAOIRequest,
  ): Observable<APIResponseObject> {
    return this.request({
      path: `recruitment/checkQuestionCountForAOI`,
      method: 'POST',
      body: request,
    });
  }
}
