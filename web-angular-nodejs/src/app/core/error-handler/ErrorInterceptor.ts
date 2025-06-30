import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { SessionService } from '../../auth/services/session.service';
import { LoggerService } from '../services/logger.service';
import { LocalStorageService } from '../services/local.storage.services';
import { messageDialog } from '../models/messageDialog';
import { DialogMessages, IconNames, MessageDialogButtonNames } from '../utils/constants';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageDialogComponent } from '../dialog/message-dialog/message-dialog.component';
import { isSessionExpired } from '../constants.ts/localstorage-constant';
import { ResponseMessages } from '../constants/messages';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  dialog: MatDialog = inject(MatDialog);
  constructor(
    private sessionService: SessionService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
  ) {}

  intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          [401].includes(err.status) &&
          !this.localStorageService.getItem(isSessionExpired) &&
          err?.error?.message === ResponseMessages.UnauthorizedLogout
        ) {
          this.dialog.closeAll();
          this.toastr.clear();
          const messageDialogData = new messageDialog(
            DialogMessages.SessionExpired,
            DialogMessages.Empty,
            IconNames.HighlightOff,
            true,
            false,
            MessageDialogButtonNames.YesLogout,
          );
          const config: MatDialogConfig = {
            width: '520px',
            height: '320px',
            disableClose: true,
            data: messageDialogData,
          };
          this.dialog
            .open(MessageDialogComponent, config)
            .beforeClosed()
            .subscribe((result) => {
              this.sessionService.logout(false);
              this.localStorageService.setItem(isSessionExpired, true);
            });
        }
        const error = err.error?.message || err.statusText;
        LoggerService.error(error);
        return throwError(() => err);
      }),
    );
  }
}
