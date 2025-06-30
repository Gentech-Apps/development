import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService extends ApiService {
  getAllMenusByUserId() {
    return this.request({
      path: `recruitment/menus/getAllMenusWithPermissions`,
      method: 'GET',
    });
  }

  getUrlMapByUserId() {
    return this.request({
      path: `recruitment/menus/getUrlMap`,
      method: 'GET',
    });
  }
}
