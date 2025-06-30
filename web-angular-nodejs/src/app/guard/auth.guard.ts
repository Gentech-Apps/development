import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../auth/services/session.service';
import { LocalStorageService } from '../core/services/local.storage.services';
import { MenuService } from '../core/services/menu.service';
import { LocalStorageKeys } from '../core/utils/constants';
import { URL } from '../core/constants/url-constants';

export const authGuard: CanActivateFn = (route, state) => {
  let router = new Router();
  const localStorage: LocalStorageService = new LocalStorageService();
  const session: SessionService = new SessionService(localStorage, router, inject(MenuService));
  let isLogin = localStorage.getItem(LocalStorageKeys.LogIn);
  if (
    isLogin ||
    state?.url?.includes(URL.ReferralRegistration) ||
    state?.url?.includes(URL.MyReferral)
  ) {
    return true;
  }
  session.logout(false);
  return false;
};
