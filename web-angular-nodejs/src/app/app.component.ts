import { Component, HostListener } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { SessionService } from './auth/services/session.service';
import { ErrorCode } from './core/enums/ErrorCode';
import { LocalStorageService } from './core/services/local.storage.services';
import { MenuService } from './core/services/menu.service';
import { UtilsService } from './core/services/utils.service';
import { LocalStorageKeys, PageRoutes, RouteWithoutLayout } from './core/utils/constants';
import { LoggerService } from './core/services/logger.service';
import { LoggerMessages } from './core/constants/messages';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  routeWithoutLayout: (string | RegExp)[] = RouteWithoutLayout;
  showLayout: boolean = false;
  pageNotFoundUrl = `/${PageRoutes.ErrorPage}/${ErrorCode.NOT_FOUND}`;

  constructor(
    private sessionService: SessionService,
    private utilsService: UtilsService,
    private router: Router,
    private menuService: MenuService,
    private localStorageService: LocalStorageService,
  ) {
    if (sessionService.isLogin.value && (location.pathname === '/' || location.pathname === '')) {
      this.menuService
        .getAllMenuWithPermission(this.localStorageService.getItem(LocalStorageKeys.UserId))
        .then((url: string) => {
          if (url?.length > 0) {
            this.router.navigate([url]);
          }
        })
        .catch((reject: PromiseRejectedResult) => {
          LoggerService.log(LoggerMessages.LoginFailed, reject);
          window.history.back();
        });
    }

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes('/?') ||
          event.url.includes('#') ||
          event.urlAfterRedirects == this.pageNotFoundUrl
        ) {
          this.utilsService.navigateToPageNotFound();
          this.routeWithoutLayout.push(event.url);
        }
        this.showLayout = this.checkForLayout(event.url);
      }
    });
  }

  checkForLayout(url: string): boolean {
    let found: boolean = false;

    this.routeWithoutLayout.forEach((route: string | RegExp) => {
      switch (typeof route) {
        case 'string':
          if (route == url) {
            found = true;
          }
          break;

        case 'object':
          if (route.test(url) == true) {
            found = true;
          }
      }
    });

    return found ? false : true;
  }

  @HostListener('window:beforeunload', ['$event'])
  storeMenusInLocalStorage($event: BeforeUnloadEvent) {
    if (Object.keys(this.menuService.urlMap.value).length > 0) {
      this.localStorageService.setItem(
        LocalStorageKeys.UrlMap,
        JSON.stringify(this.menuService.urlMap.value) ?? [],
      );
    }
  }
}
