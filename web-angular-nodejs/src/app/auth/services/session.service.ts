import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../core/services/local.storage.services';
import { MenuService } from '../../core/services/menu.service';
import { LocalStorageKeys } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  isLogin = new BehaviorSubject(false);

  public login() {
    this.storageService.setItem(LocalStorageKeys.LogIn, true);
    this.isLogin.next(true);
  }

  public logout(isAutoDisqualified: boolean) {
    this.isLogin.next(false);
    this.storageService.removeItem(LocalStorageKeys.LogIn);
    this.storageService.removeItem(LocalStorageKeys.UserType);
    this.storageService.removeItem(LocalStorageKeys.Token);
    this.storageService.removeItem(LocalStorageKeys.LoginId);
    this.storageService.removeItem(LocalStorageKeys.Load);
    this.storageService.removeItem(LocalStorageKeys.IsWalkIn);
    this.storageService.removeItem(LocalStorageKeys.IsStart);
    this.storageService.removeItem(LocalStorageKeys.UserId);
    this.storageService.removeItem(LocalStorageKeys.CategoryId);
    this.storageService.removeItem(LocalStorageKeys.LoginStatus);
    this.storageService.removeItem(LocalStorageKeys.UserAgoraStatus);
    this.storageService.removeItem(LocalStorageKeys.Name);
    this.storageService.setItem(LocalStorageKeys.IsSessionExpired, true);
    this.storageService.removeItem(LocalStorageKeys.UrlMap);
    this.menuService.addUrlMap({});
    if (!isAutoDisqualified) {
      this.router.navigate(['']);
    }
  }

  constructor(
    private storageService: LocalStorageService,
    private router: Router,
    private menuService: MenuService,
  ) {
    let login = storageService.getItem(LocalStorageKeys.LogIn);
    if (login) {
      this.isLogin.next(true);
    } else {
      this.isLogin.next(false);
    }
  }
}
