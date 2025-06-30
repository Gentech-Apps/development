import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceInfo } from 'ngx-device-detector/public-api';
import { ToastrService } from 'ngx-toastr';
import { agoraId } from '../../../core/constants.ts/localstorage-constant';
import { FormControlVariables } from '../../../core/constants.ts/form-control-variables';
import { objective } from '../../../core/constants.ts/paper-type.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { publicIpv4 } from 'public-ip';
import { AgoraClientConfig } from '../../../core/config/AgoraConfig';
import {
  AgoraRtcEvent,
  AgoraRtcMediaType,
  AgoraStatus,
  RTC,
} from '../../../core/constants/agoraRtc';
import { LoggerMessages, ResponseMessages, TosterMessages } from '../../../core/constants/messages';
import { Regex } from '../../../core/constants/regex';
import { checkIsNotExaminee } from '../../../core/helpers/checkIsUserType';
import { IAgoraOption } from '../../../core/interface/IAgoraOptions';
import { IRtc } from '../../../core/interface/IRtc';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { UserModel } from '../../../core/models/user.model';
import { InternetService } from '../../../core/services/internet.service';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { LoggerService } from '../../../core/services/logger.service';
import { MenuService } from '../../../core/services/menu.service';
import { MedialType } from '../../../core/types/agoraRtcTypes';
import { getLogoutModelObject } from '../../../core/utils/commonFunction';
import {
  AgoraOption,
  DialogMessages,
  IconNames,
  LocalStorageKeys,
  MessageDialogButtonNames,
  MessageDialogTitles,
  PageRoutes,
  PaperTypes,
} from '../../../core/utils/constants';
import { LayoutService } from '../../../layout/service/layout-service';
import { UserWarningMessageDialogComponent } from '../../dialogs/user-warning-message-dialog/user-warning-message-dialog.component';
import { UserWarningMessageSubmitDialogComponent } from '../../dialogs/user-warning-message-submit-dialog/user-warning-message-submit-dialog.component';
import { InstructionsModel } from '../../models/instructions.model';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { ForgotPasswordDialogComponent } from '../../dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { MessageDialogComponent } from '../../../core/dialog/message-dialog/message-dialog.component';
import { messageDialog } from '../../../core/models/messageDialog';
import { LoginModel } from '../../models/login.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;

  rtc: IRtc = RTC;
  options: IAgoraOption = AgoraOption;
  user: UserModel | undefined;
  map = new Map();
  AgoraID: string = '';
  deviceInfo: DeviceInfo | undefined;
  screenWidth: number = 0;
  screenHeight: number = 0;
  isLogin: boolean = false;
  userId: number = 0;
  otherMessage: string = '';
  userStatus: string = '';
  showLoader: boolean = false;
  publicIp: string = '';
  passwordType: string = 'password';
  objectiveMore: boolean = true;
  subjectiveMore: boolean = true;
  objectiveInstructions: boolean = false;
  subjectiveInstructions: boolean = false;
  isTermsAccept: boolean = false;
  showObjectiveInstructions: boolean = false;
  showSubjectiveInstructions: boolean = false;
  objectiveList: InstructionsModel[] = [];
  subjectiveList: InstructionsModel[] = [];
  paperType: typeof PaperTypes = PaperTypes;
  loginModel!: LoginModel;

  loginForm: FormGroup = this.formBuilder.group({
    [this.formControlVariables.email]: [
      '',
      { validators: [Validators.required, Validators.pattern(Regex.Email)], updateOn: 'change' },
    ],
    password: [
      '',
      { validators: [Validators.required, Validators.minLength(8)], updateOn: 'change' },
    ],
  });

  getEmail(): string {
    return this.loginForm.controls[this.formControlVariables.email].value;
  }

  getPassword(): string {
    return this.loginForm.controls[this.formControlVariables.password].value;
  }

  constructor(
    private menuService: MenuService,
    private layoutService: LayoutService,
    private toaster: ToastrService,
    private session: SessionService,
    private storageService: LocalStorageService,
    private dialog: MatDialog,
    private internetService: InternetService,
    private snackBar: MatSnackBar,
    private authApi: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private deviceService: DeviceDetectorService,
    public formControlVariables: FormControlVariables,
    private sessionService: SessionService,
  ) {
    this.epicFunction();
  }

  ngOnInit() {
    history.pushState(null, '', location.href);
    this.user = new UserModel();
    this.loginModel = new LoginModel();
    this.getIntructions();
  }

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (
      event.keyCode == 116 ||
      event.keyCode == 123 ||
      (event.ctrlKey && event.shiftKey && event.keyCode == 73) ||
      (event.ctrlKey && event.shiftKey && event.keyCode == 74)
    ) {
      event.preventDefault();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  epicFunction(): void {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    LoggerService.log(this.deviceInfo);
    LoggerService.log(isMobile); // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    LoggerService.log(isTablet); // returns if the device us a tablet (iPad etc)
    LoggerService.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    if (isMobile || isTablet) {
      this.openUnsupportedDeviceDialog();
    }

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenHeight > this.screenWidth) {
      this.openUnsupportedDeviceDialog();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenHeight > this.screenWidth) {
      this.openUnsupportedDeviceDialog();
    }
  }

  hasError(controlName: string, errorName: string) {
    return (
      this.loginForm.controls[controlName].hasError(errorName) &&
      this.loginForm.controls[controlName].touched
    );
  }

  objectiveContent(): void {
    this.objectiveMore = false;
    this.objectiveInstructions = true;
  }

  subjectiveContent(): void {
    this.subjectiveMore = false;
    this.subjectiveInstructions = true;
  }

  navigate(): void {
    this.router.navigate([PageRoutes.RegisterPage]);
  }

  showPassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  async loginUser() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    if (this.loginModel) {
      this.isLogin = true;
      await this.getPublicIP();
      this.loginModel.email = this.getEmail();
      this.loginModel.password = this.getPassword();
      this.loginModel.publicIp = this.publicIp;
      this.showLoader = true;
      this.authApi.loginUser(this.loginModel).subscribe(
        async (res: APIResponseObject) => {
          if (res?.result) {
            this.userId = res?.data?.id;
            this.storageService.setItem(LocalStorageKeys.IsSessionExpired, false);
            if (res?.message?.type == ResponseMessages.ShowWarningPopup) {
              this.showLoader = false;
              this.openUserWarningDialog();
            } else {
              let user = res?.data;
              this.storageService.setItem(LocalStorageKeys.UserType, user.userType);
              this.storageService.setItem(LocalStorageKeys.LoginId, user.id?.toString());
              this.storageService.setItem(
                LocalStorageKeys.Name,
                user.firstName + ' ' + user.lastName,
              );
              this.storageService.setItem(LocalStorageKeys.Token, user.token?.toString());
              this.session.login();
              if (checkIsNotExaminee(user.userType)) {
                this.storageService.setItem(LocalStorageKeys.Load, false);
                this.menuService
                  .getAllMenuWithPermission(this.userId)
                  .then((url: string) => {
                    this.showLoader = false;
                    if (url?.length > 0) {
                      const messageDialogData = new messageDialog(
                        res.message.title,
                        res.message.message,
                        res.message.icon,
                        true,
                        false,
                        MessageDialogButtonNames.OK,
                      );
                      const config: MatDialogConfig = {
                        width: res.message.width,
                        height: res.message.height,
                        disableClose: true,
                        data: messageDialogData,
                      };
                      this.dialog.closeAll();
                      this.dialog
                        .open(MessageDialogComponent, config)
                        .afterClosed()
                        .subscribe((result) => {
                          this.router.navigate([url]);
                        });
                    } else {
                      this.isLogin = false;
                      this.logout(user.id);
                      this.showErrorPopup(
                        MessageDialogTitles.Unauthorized,
                        DialogMessages.DoNotHaveAccessOfAnyPage,
                      );
                    }
                  })
                  .catch((reject: PromiseRejectedResult) => {
                    LoggerService.log(LoggerMessages.LoginFailed, reject);
                    this.isLogin = false;
                    this.logout(user.id);
                    this.showErrorPopup(MessageDialogTitles.InternalServerError, '');
                  });
              } else if (user.message == ResponseMessages.LoginSuccessful) {
                this.showLoader = false;
                this.setDeatilsToLocalStorage(user);
                if (user.agoraStatus == AgoraStatus.Restricted) {
                  this.snackBar.open(TosterMessages.WaitSomtimeToMoveOnNextScreen, '', {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar'],
                  });
                  this.startCall(user, res);
                } else {
                  const messageDialogData = new messageDialog(
                    res.message.title,
                    res.message.message,
                    res.message.icon,
                    true,
                    false,
                    MessageDialogButtonNames.OK,
                  );
                  const config: MatDialogConfig = {
                    width: res.message.width,
                    height: res.message.height,
                    disableClose: true,
                    data: messageDialogData,
                  };
                  this.dialog.closeAll();
                  this.dialog
                    .open(MessageDialogComponent, config)
                    .afterClosed()
                    .subscribe((result) => {
                      this.router.navigate([PageRoutes.QuestionTypePage]);
                    });
                }
              }
            }
          }
        },
        (error: HttpErrorResponse) => {
          const res = error.error;
          this.showLoader = false;
          if (res) {
            const messageDialogData = new messageDialog(
              res.message.title,
              res.message.message,
              res.message.icon,
              true,
              false,
              MessageDialogButtonNames.OK,
            );
            const config: MatDialogConfig = {
              width: res.message.width,
              height: res.message.height,
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog
              .open(MessageDialogComponent, config)
              .afterClosed()
              .subscribe((result) => {
                this.isLogin = false;
                this.router.navigate([PageRoutes.AuthPage]);
              });
          } else if (this.internetService.checkInternetConnectivity()) {
            const messageDialogData = new messageDialog(
              MessageDialogTitles.NetworkIssue,
              DialogMessages.NetworkIssueMesssage,
              IconNames.ErrorOutline,
              true,
              false,
              MessageDialogButtonNames.OK,
            );
            const config: MatDialogConfig = {
              width: '570px',
              height: '360px',
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog
              .open(MessageDialogComponent, config)
              .afterClosed()
              .subscribe(() => {
                this.isLogin = false;
              });
          } else {
            const messageDialogData = new messageDialog(
              MessageDialogTitles.Error,
              DialogMessages.PlaseContactHr,
              IconNames.HighlightOff,
              true,
              false,
              MessageDialogButtonNames.OK,
            );
            const config: MatDialogConfig = {
              width: '570px',
              height: '360px',
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog.open(MessageDialogComponent, config);
          }
          this.router.navigate([PageRoutes.AuthPage]);
        },
      );
    }
  }

  openUserWarningDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(UserWarningMessageDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.openUserWarningSubmitDialog();
      } else {
        this.dialog.closeAll();
        this.isLogin = false;
      }
    });
  }

  openUserWarningSubmitDialog() {
    this.showLoader = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      userId: this.userId,
    };

    const dialogRef = this.dialog.open(UserWarningMessageSubmitDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data != undefined && data?.goBack == true) {
        this.showLoader = false;
        this.openUserWarningDialog();
      } else {
        this.dialog.closeAll();
        this.isLogin = false;
        this.loginUser();
      }
    });
    this.showLoader = false;
  }

  mapToJSONMap(map: Map<string, string>) {
    let jsonObject: any = {};
    map.forEach((value: string, key: string) => {
      jsonObject[key] = value;
    });
    return jsonObject;
  }

  async startCall(user: UserModel, response: APIResponseObject) {
    LoggerService.log(`${LoggerMessages.RtcDataLog}`, this.rtc);
    this.rtc.client = AgoraRTC.createClient(AgoraClientConfig);
    LoggerService.log(LoggerMessages.AgoraClientCreated);
    try {
      await this.rtc.client.join(
        this.options.appId,
        this.options.channel,
        this.options.token,
        null,
      );
      LoggerService.log(LoggerMessages.JoinSuccess);
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      LoggerService.log(LoggerMessages.LocalAudioAndVideoCreated);
    } catch (error) {
      LoggerService.log(LoggerMessages.JoinFailed, error);
      const messageDialogData = new messageDialog(
        MessageDialogTitles.CameraAndMicrophoneIsRequired,
        DialogMessages.Empty,
        IconNames.ErrorOutline,
        true,
        false,
        MessageDialogButtonNames.OK,
      );
      const config: MatDialogConfig = {
        width: '570px',
        height: '410px',
        disableClose: true,
        data: messageDialogData,
      };
      this.dialog.closeAll();
      this.dialog
        .open(MessageDialogComponent, config)
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.authApi
              .updateLoginStatusAndUserStatus(user.id)
              .subscribe((data: APIResponseObject) => {
                this.sessionService.logout(false);
                this.isLogin = false;
              });
          }
        });
      return;
    }

    try {
      await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
      LoggerService.log(LoggerMessages.PublishSuccess);
      let agoraID: string = String(this.rtc.client.uid);
      this.callback(agoraID);
      this.setDeatilsToLocalStorage(user);

      const messageDialogData = new messageDialog(
        response.message.title,
        response.message.message,
        response.message.icon,
        true,
        false,
        MessageDialogButtonNames.OK,
      );
      const config: MatDialogConfig = {
        width: response.message.width,
        height: response.message.height,
        disableClose: true,
        data: messageDialogData,
      };
      this.dialog.closeAll();
      this.dialog
        .open(MessageDialogComponent, config)
        .afterClosed()
        .subscribe((result) => {
          this.router.navigate([PageRoutes.QuestionTypePage]);
        });
    } catch (e) {
      LoggerService.log(LoggerMessages.PublishingFailed, e);
      return;
    }

    this.rtc.client.on(
      AgoraRtcEvent.UserPublished,
      async (user: IAgoraRTCRemoteUser, mediaType: MedialType) => {
        await this.rtc.client?.subscribe(user, mediaType);
        if (mediaType == AgoraRtcMediaType.Video) {
          LoggerService.log(LoggerMessages.VideoSubscribeSuccess);
        }
        if (mediaType == AgoraRtcMediaType.Audio) {
          LoggerService.log(LoggerMessages.AudioSubscribeSuccess);
        }
      },
    );

    this.rtc.client.on(AgoraRtcEvent.UserUnpublished, async (user: IAgoraRTCRemoteUser) => {
      LoggerService.log(`${LoggerMessages.ChanelLeftByUser}`, user.uid);
      this.rtc.localAudioTrack?.close();
      this.rtc.localVideoTrack?.close();
    });

    this.rtc.client.on(AgoraRtcEvent.UserJoined, async (user: IAgoraRTCRemoteUser) => {
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      LoggerService.log(AgoraRtcEvent.UserJoined);
    });

    this.rtc.client.on(AgoraRtcEvent.UserLeft, async (user: IAgoraRTCRemoteUser) => {
      LoggerService.log(AgoraRtcEvent.UserLeft);
      this.rtc.localAudioTrack?.close();
      this.rtc.localVideoTrack?.close();
    });
  }

  callback(agoraID: string): void {
    this.map.set(agoraId, agoraID);
    let sendMap = this.mapToJSONMap(this.map);
    this.authApi
      .updateAgoraId({
        userId: Number(this.storageService.getItem(LocalStorageKeys.UserId)),
        data: sendMap,
      })
      .subscribe((data) => {
        LoggerService.log(data);
      });
  }

  async getPublicIP(): Promise<void> {
    await publicIpv4().then((ip) => {
      this.publicIp = ip;
    });
    LoggerService.log(`${LoggerMessages.PublicIpLog}`, this.publicIp);
  }

  setDeatilsToLocalStorage(user: UserModel) {
    this.isLogin = true;
    this.storageService.setItem(LocalStorageKeys.IsWalkIn, user.walkIn);
    this.storageService.setItem(LocalStorageKeys.IsStart, true);
    this.storageService.setItem(LocalStorageKeys.UserId, user.id);
    this.storageService.setItem(LocalStorageKeys.UserType, user.userType);
    this.storageService.setItem(LocalStorageKeys.CategoryId, user.areaOfInterestId);
    this.storageService.setItem(LocalStorageKeys.Token, user.token);
    this.storageService.setItem(LocalStorageKeys.LoginStatus, '');
    this.storageService.setItem(LocalStorageKeys.ExamineeDriveId, user.driveId);
    this.storageService.setItem(LocalStorageKeys.Name, user.firstName + ' ' + user.lastName);
    this.storageService.setItem(LocalStorageKeys.UserAgoraStatus, user.agoraStatus);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    history.pushState(null, '', location.href);
  }

  showMoreInstructions(option: string) {
    option == objective
      ? (this.showObjectiveInstructions = true)
      : (this.showSubjectiveInstructions = true);
  }

  getIntructions() {
    this.authApi.getInstructions(this.paperType.ALL).subscribe(
      (res: APIResponseObject) => {
        if (res.result) {
          const instructionsList: InstructionsModel[] = res?.data;
          instructionsList.forEach((instruction) => {
            instruction.paperTypeId == this.paperType.OBJECTIVE
              ? this.objectiveList.push(instruction)
              : this.subjectiveList.push(instruction);
          });
        } else {
          this.toaster.error(res.message);
        }
      },
      (error: any) => {
        LoggerService.log(`${LoggerMessages.Error}`, error);
      },
    );
  }

  logout(userId: number) {
    this.authApi.logoutUser(getLogoutModelObject(userId)).subscribe(
      (response: APIResponseObject) => {
        if (response.result) {
          this.session.logout(true);
        } else {
          this.toaster.error(response.message);
        }
      },
      (error: any) => {
        LoggerService.log(`${LoggerMessages.Error}`, error);
      },
    );
  }

  showErrorPopup(title: string, text?: string) {
    const messageDialogData = new messageDialog(
      title,
      text ?? '',
      IconNames.ErrorOutline,
      true,
      false,
      MessageDialogButtonNames.OK,
    );
    const config: MatDialogConfig = {
      width: '570px',
      height: '360px',
      disableClose: true,
      data: messageDialogData,
    };
    this.dialog.closeAll();
    this.dialog.open(MessageDialogComponent, config);
  }

  openForgotPasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = 'fit-content';
    dialogConfig.width = '600px';
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, dialogConfig);
  }

  openUnsupportedDeviceDialog() {
    const messageDialogData = new messageDialog(
      MessageDialogTitles.UnsupportedDevice,
      DialogMessages.UnsupportedDeviceMessage,
      IconNames.ErrorOutline,
      true,
      false,
      MessageDialogButtonNames.OK,
    );
    const config: MatDialogConfig = {
      width: '570px',
      height: '360px',
      disableClose: true,
      data: messageDialogData,
    };
    this.dialog.closeAll();
    this.dialog
      .open(MessageDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          window.history.back();
        }
      });
  }
}
