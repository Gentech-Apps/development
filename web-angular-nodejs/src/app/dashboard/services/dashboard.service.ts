import { Injectable } from '@angular/core';
import { IDashboardApiRequest } from 'src/app/core/interface/IDashboardApiRequest';
import { ExamineeResultModel } from 'src/app/core/models/examineeResult.model';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable()
export class DashboardService extends ApiService {
  GetAreaOfInterestList() {
    return this.request({
      path: 'recruitment/users/getAllAreasOfInterest',
      method: 'GET',
    });
  }

  GetDashboardDetails(dashboardRequest: IDashboardApiRequest) {
    return this.request({
      path: 'recruitment/users/dashboard',
      method: 'POST',
      body: dashboardRequest,
    });
  }

  GetTotalCountOfDashboardDetails() {
    return this.request({
      path: 'recruitment/users/totalExamDates',
      method: 'GET',
    });
  }

  GetDashboardDescriptionDetails(dashboardRequest: IDashboardApiRequest) {
    return this.request({
      path: 'recruitment/users/dashboardDescription',
      method: 'POST',
      body: dashboardRequest,
    });
  }

  GetCompletedExamineeDetails(dashboardRequest: IDashboardApiRequest) {
    return this.request({
      path: 'recruitment/users/dashboardCompletedDescription',
      method: 'POST',
      body: dashboardRequest,
    });
  }

  UpdateExameResultStatus(examineeResult: ExamineeResultModel) {
    return this.request({
      path: 'recruitment/users/updateUserExamStatus',
      method: 'POST',
      body: examineeResult,
    });
  }

  sendQualifiedMail(userIds: number[]) {
    return this.request({
      path: 'recruitment/users/qualifiedMail',
      method: 'POST',
      body: userIds,
    });
  }

  sendDisqualifiedMail(userIds: number[]) {
    return this.request({
      path: 'recruitment/users/disquaifiedMail',
      method: 'POST',
      body: userIds,
    });
  }

  getAreaOfInterestListForFilter(date: string, status: string, areaOfInterestId: number) {
    return this.request({
      path:
        'recruitment/users/getAreaOfInterestListForFilter?date=' +
        date +
        '&status=' +
        status +
        '&areaOfInterestId=' +
        areaOfInterestId,
      method: 'GET',
    });
  }
}
