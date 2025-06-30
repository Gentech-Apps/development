import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordDialogComponent } from '../../auth/dialogs/change-password-dialog/change-password-dialog.component';
import { AuthService } from '../../auth/services/auth.service';
import { APIResponseObject } from '../../core/interface/apiResponseObject';
import { LocalStorageService } from '../../core/services/local.storage.services';
import { MenuService } from '../../core/services/menu.service';
import { getLogoutModelObject } from '../../core/utils/commonFunction';
import { SessionService } from '../../auth/services/session.service';
import { LoaderConfig } from '../../core/constants/loader';
import { IFlatMenu } from '../../core/interface/IFlatMenu';
import { IMenuList } from '../../core/interface/IMenuList';
import { LoaderConfigInteface } from '../../core/interface/loaderConfig';
import { HeaderService } from '../../core/services/header.service';
import { LoggerService } from '../../core/services/logger.service';
import {
  DialogMessages,
  IconNames,
  LocalStorageKeys,
  MessageDialogButtonNames,
  MessageDialogTitles,
} from '../../core/utils/constants';
import { LayoutService } from '../service/layout-service';
import { showPermissionChangedPopup } from '../../guard/role.guard';
import { messageDialog } from '../../core/models/messageDialog';
import { MessageDialogComponent } from '../../core/dialog/message-dialog/message-dialog.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  loaderConfig: LoaderConfigInteface = LoaderConfig;
  loader: boolean = false;
  isExpanded = false;
  showSubmenu: boolean = false;
  showSubSubMenu: boolean = false;
  userType: string = '';
  headerTitle: string = '';
  currentUrl: string = '';
  adminRole: string[] = ['Admin', 'SuperAdmin'];
  exminerRole: string[] = ['Admin', 'Examiner', 'SuperAdmin'];
  invigilatorRole: string[] = ['Admin', 'Invigilator', 'Examiner', 'SuperAdmin'];
  SubUserListTab: IMenuList[] = [];

  ngOnInit(): void {
    this.loadContent();
    this.header.currentMessage.subscribe((message) => (this.headerTitle = message));
  }

  private _transformer = (node: IMenuList, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url,
      target: node.target,
      icon: node.icon,
      isExpanded: node.isExpanded,
      access: node.access ?? '',
    };
  };

  treeControl = new FlatTreeControl<IFlatMenu>(
    (node: any) => node.level,
    (node: any) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node: any) => node.level,
    (node: any) => node.expandable,
    (node: any) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private toster: ToastrService,
    private router: Router,
    private header: HeaderService,
    private session: SessionService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private layoutService: LayoutService,
  ) {
    this.SubUserListTab = this.menuService.getMenuList();
    this.dataSource.data = this.SubUserListTab;
    this.currentUrl = router.url;
    this.menuService.url.subscribe((url: string) => {
      this.currentUrl = url;
    });
  }

  loadContent() {
    if (this.SubUserListTab?.length == 0) {
      this.loader = true;
      this.layoutService.getAllMenusByUserId().subscribe(
        (response: APIResponseObject) => {
          this.loader = false;
          if (response.result) {
            this.SubUserListTab = response?.data?.menuList ?? [];
            this.menuService.addUrlMap(response?.data?.permissionMap ?? []);
            this.dataSource.data = this.SubUserListTab;
            const previousUrlMapString =
              this.localStorageService.getItem(LocalStorageKeys.UrlMap) ?? [];
            const currentUrlMapString = JSON.stringify(response?.data?.permissionMap ?? []);
            if (
              previousUrlMapString != undefined &&
              previousUrlMapString?.length != 0 &&
              previousUrlMapString !== currentUrlMapString
            ) {
              showPermissionChangedPopup(
                this.session,
                this.localStorageService.getItem(LocalStorageKeys.UserType) ?? '',
                this.dialog,
              );
            }
          } else {
            this.gotLoginPage();
          }
        },
        (error: any) => {
          this.loader = false;
          this.gotLoginPage();
          LoggerService.log('error==>', error);
        },
      );
    }
  }

  hasChild = (_: number, node: IFlatMenu) => node.expandable;

  hasParent = (node: IFlatMenu) => this.treeControl.getLevel(node) < 1;

  expand = (node: IFlatMenu) => {
    if (!this.treeControl.isExpanded(node)) {
      this.treeControl.collapseAll();
      this.treeControl.expand(node);
    } else {
      this.treeControl.collapse(node);
    }
  };

  onOpenCloseSideBar = () => {
    LoggerService.log('clicked1', this.isExpanded);
    if (this.isExpanded) {
      this.isExpanded = false;
      this.treeControl.collapseAll();
    } else {
      this.openCurrentActiveNode();
    }
  };

  handleMenuOpenClose = () => {
    if (!this.isExpanded) {
      LoggerService.log('handleMenuOpenClose');
      this.isExpanded = true;
      this.openCurrentActiveNode();
    }
  };

  openCurrentActiveNode = () => {
    this.SubUserListTab.forEach((parentNode: IMenuList) => {
      let flag: boolean = false;
      if (parentNode?.children != undefined) {
        parentNode?.children.forEach((childNode: IMenuList) => {
          flag = false;
          if (childNode.url == this.router.url) {
            parentNode.isExpanded = true;
          }
        });
      }
    });
    LoggerService.log('jhjkhj==>', this.SubUserListTab);
    this.dataSource.data = this.SubUserListTab;
    this.isExpanded = true;
    let tempNode: any = this.treeControl.dataNodes.find((node: any) => node.isExpanded);
    this.treeControl.expand(tempNode);
  };

  changeExpandedNode = (nodeName: string) => {
    LoggerService.log('Name==>', nodeName);
    this.SubUserListTab.forEach((parentNode: IMenuList) => {
      let flag: boolean = false;
      if (parentNode?.children != undefined) {
        let temp = false;
        parentNode?.children.forEach((childNode: IMenuList) => {
          if (childNode.name == nodeName) {
            temp = true;
          }
        });
        parentNode.isExpanded = temp;
      }
    });
    LoggerService.log('updated array==>', this.SubUserListTab);
    this.dataSource.data = this.SubUserListTab;
    let tempNode: any = this.treeControl.dataNodes.find((node: any) => node.isExpanded);
    this.treeControl.expand(tempNode);
  };

  logoutPopUp() {
    const messageDialogData = new messageDialog(
      MessageDialogTitles.ConfirmationForLogout,
      DialogMessages.Empty,
      IconNames.HelpOutline,
      true,
      true,
      MessageDialogButtonNames.YesLogout,
    );
    const config: MatDialogConfig = {
      width: '460px',
      height: '350px',
      disableClose: true,
      data: messageDialogData,
    };
    this.dialog.closeAll();
    this.dialog
      .open(MessageDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.logout();
        }
      });
  }

  logout() {
    const userId = this.localStorageService.getItem(LocalStorageKeys.LoginId);
    this.authService.logoutUser(getLogoutModelObject(userId)).subscribe(
      (response: APIResponseObject) => {
        if (response.result) {
          this.session.logout(false);
        } else {
          this.toster.error(response.message);
        }
      },
      (error: any) => {
        LoggerService.log('error', error);
      },
    );
  }

  navigate(target: string, url: string) {
    if (target != '') {
      window.open(url, '_blank');
    } else {
      let isLogin = this.localStorageService.getItem(LocalStorageKeys.LogIn);
      if (!isLogin) {
        this.session.logout(false);
      } else {
        this.router.navigate([url]);
      }
    }
  }

  openChangePasswordComponent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '425px';

    this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
  }

  gotLoginPage() {
    const messageDialogData = new messageDialog(
      MessageDialogTitles.InternalServerError,
      DialogMessages.Empty,
      IconNames.HighlightOff,
      true,
      false,
      MessageDialogButtonNames.OK,
    );
    const config: MatDialogConfig = {
      width: '460px',
      height: '350px',
      disableClose: true,
      data: messageDialogData,
    };
    this.dialog.closeAll();
    this.dialog
      .open(MessageDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        this.logout();
      });
  }
}
