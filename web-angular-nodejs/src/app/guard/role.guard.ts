import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { APIResponseObject } from '../core/interface/apiResponseObject';
import { LoggerService } from '../core/services/logger.service';
import { LayoutService } from '../layout/service/layout-service';
import { SessionService } from '../auth/services/session.service';
import { LoggerMessages, SwalPopupMessages, SwalPopupTitles } from '../core/constants/messages';
import { ErrorCode } from '../core/enums/ErrorCode';
import { LocalStorageService } from '../core/services/local.storage.services';
import { MenuService } from '../core/services/menu.service';
import {
  DialogMessages,
  IconNames,
  LocalStorageKeys,
  MessageDialogButtonNames,
  MessageDialogTitles,
  PageRoutes,
  PublicChildRoutes,
} from '../core/utils/constants';
import { messageDialog } from '../core/models/messageDialog';
import { MessageDialogComponent } from '../core/dialog/message-dialog/message-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

export const roleGuard: CanActivateFn = async function (route, state) {
  const layoutService = inject(LayoutService);
  const sessionService = inject(SessionService);
  const menuService = inject(MenuService);
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const dialog = inject(MatDialog);
  const isAuthorized = await isValidRoute(
    route,
    layoutService,
    menuService,
    sessionService,
    router,
    localStorageService,
    dialog,
  );
  return isAuthorized;
};

async function isValidRoute(
  route: ActivatedRouteSnapshot,
  layoutService: LayoutService,
  menuService: MenuService,
  sessionService: SessionService,
  router: Router,
  localStorageService: LocalStorageService,
  dialog: MatDialog,
) {
  let isValid = false;
  let newUrlMap: { [key: string]: string } = {};
  let oldUrlMap: { [key: string]: string } =
    menuService.urlMap.value ?? localStorageService.getItem(LocalStorageKeys.UrlMap) ?? [];
  let currentUrl = extractRoute(route);

  if (PublicChildRoutes.includes(currentUrl)) {
    return true;
  }
  menuService.setCurrentUrl(currentUrl);
  newUrlMap = await getUrlMap(layoutService, dialog);

  //Internet is not connected newUrlMap{} empty.
  if (Object.entries(newUrlMap).length === 0) {
    return isValid;
  }

  const newMenuString = JSON.stringify(newUrlMap);
  const oldMenuString = JSON.stringify(oldUrlMap);

  const oldUrlMapTotalKeys = Object.keys(oldUrlMap).length;
  if (newMenuString === oldMenuString || oldUrlMapTotalKeys === 0) {
    const newUrlArray = Object.keys(newUrlMap);

    if (
      !localStorageService.getItem[LocalStorageKeys.IsSessionExpired] &&
      Object.entries(newUrlMap).length == 0
    ) {
      return isValid;
    }

    if (!newUrlArray?.includes(currentUrl)) {
      router.navigate([PageRoutes.ErrorPage, ErrorCode.UNAUTHORIZED]);
    }
    if (oldUrlMapTotalKeys === 0) {
      menuService.addUrlMap(newUrlMap);
    }

    isValid = true;
  } else {
    const role: string = localStorageService.getItem(LocalStorageKeys.UserType) ?? '';
    if (
      Object.entries(newUrlMap).length != 0 &&
      !Boolean(localStorageService.getItem(LocalStorageKeys.IsSessionExpired))
    ) {
      menuService.addUrlMap({});
      showPermissionChangedPopup(sessionService, role, dialog);
      isValid = false;
    }
  }
  return isValid;
}

function getUrlMap(
  layoutService: LayoutService,
  dialog: MatDialog,
): Promise<{ [key: string]: string }> {
  return new Promise((resolve, reject) => {
    let newMenuMap: { [key: string]: string } = {};
    layoutService.getUrlMapByUserId().subscribe(
      (res: APIResponseObject) => {
        if (res.result) {
          newMenuMap = res?.data ?? {};
          resolve(newMenuMap);
        } else {
          resolve(newMenuMap);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 0) {
          showNetworkPopUp(dialog);
        }
        resolve(newMenuMap);
        LoggerService.log(LoggerMessages.Error, error);
      },
    );
  });
}

export function showPermissionChangedPopup(
  sessionService: SessionService,
  role: string,
  dialog: MatDialog,
) {
  sessionService.logout(false);
  const messageDialogData = new messageDialog(
    MessageDialogTitles.ActionRequired,
    `${role}'s ${SwalPopupMessages.RolePermissionUpdated}`,
    IconNames.ErrorOutline,
    true,
    false,
    MessageDialogButtonNames.OK,
  );
  const config: MatDialogConfig = {
    width: '475px',
    height: '380px',
    disableClose: true,
    data: messageDialogData,
  };
  dialog.closeAll();
  dialog
    .open(MessageDialogComponent, config)
    .afterClosed()
    .subscribe((result) => {
      sessionService.logout(false);
    });
}

function extractRoute(route: ActivatedRouteSnapshot): string {
  if (route?.children.length == 0) {
    return route?.routeConfig?.path ? '/' + route?.routeConfig?.path : '';
  }
  return '/' + route?.url[0].path + extractRoute(route.children[0]);
}

function showNetworkPopUp(dialog: MatDialog) {
  const messageDialogData = new messageDialog(
    MessageDialogTitles.NetworkIssue,
    DialogMessages.PleaseCheckYourInternetConnection,
    IconNames.ErrorOutline,
    true,
    false,
    MessageDialogButtonNames.OK,
  );
  const config: MatDialogConfig = {
    width: '475px',
    height: '350px',
    disableClose: true,
    data: messageDialogData,
  };
  dialog.closeAll();
  dialog.open(MessageDialogComponent, config).afterClosed();
}
