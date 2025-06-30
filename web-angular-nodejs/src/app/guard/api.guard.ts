import { CanActivateFn } from '@angular/router';
import { LocalStorageKeys } from '../core/utils/constants';
import { LocalStorageService } from '../core/services/local.storage.services';
import { UserTypes } from '../core/enums/UserType';

export const apiGuard: CanActivateFn = (route, state) => {
  const localStorage: LocalStorageService = new LocalStorageService();
  let isLogin = localStorage.getItem(LocalStorageKeys.LogIn);
  if (
    localStorage.getItem(LocalStorageKeys.UserType)?.toLowerCase() === UserTypes.EXAMINEE &&
    !Boolean(localStorage.getItem(LocalStorageKeys.IsSessionExpired))
  ) {
    window.history.back();
  }
  return isLogin ? false : true;
};
