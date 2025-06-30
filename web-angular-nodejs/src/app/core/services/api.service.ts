import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApiParams } from '../interface/IApiParams';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local.storage.services';
@Injectable()
export class ApiService {
  constructor(
    public http: HttpClient,
    public storageService: LocalStorageService,
  ) {}

  public request(params: IApiParams, other?: any): Observable<any> {
    const { path, method, body, query } = params;
    const token = this.storageService.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (params.multipart) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post(`${environment.apiUrl}${path}`, body, { headers });
    } else if (params.isCompiler) {
      return this.http.request(method, `${environment.apiUrl2}${path}`, {
        body,
        params: query,
        headers,
        ...other,
      });
    } else {
      return this.http.request(method, `${environment.apiUrl}${path}`, {
        body,
        params: query,
        headers,
        ...other,
      });
    }
  }
}
