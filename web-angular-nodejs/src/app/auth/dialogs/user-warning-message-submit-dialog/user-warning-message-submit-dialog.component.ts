import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserWarningModel } from '../../../core/models/userWarning.model';
import { LoggerService } from '../../../core/services/logger.service';
import { APIResponseObject } from 'src/app/core/interface/apiResponseObject';
import { UserStatus } from 'src/app/core/enums/UserStatus';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-warning-message-submit-dialog',
  templateUrl: './user-warning-message-submit-dialog.component.html',
  styleUrls: ['./user-warning-message-submit-dialog.component.scss'],
})
export class UserWarningMessageSubmitDialogComponent {
  userId: number = 0;
  userStatus: string = '';
  otherMessage: string = '';
  isTermsAccept: boolean = false;
  userWarning: UserWarningModel = new UserWarningModel();
  goBack: boolean = false;
  isSubmitted: boolean = false;

  constructor(
    private tostr: ToastrService,
    private authApi: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserWarningMessageSubmitDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true;
    this.userId = this.data['userId'];
  }

  changeComments(value: string): void {
    this.otherMessage = value;
  }

  changeStatus(status: string): void {
    this.userStatus = status;
  }

  isDisableButton(): boolean {
    if (this.userStatus != '' && this.isTermsAccept) {
      return false;
    } else {
      return true;
    }
  }

  submitWarningMessage(): void {
    this.isSubmitted = true;
    this.userWarning.userId = this.userId;
    this.userWarning.userStatus = this.userStatus;
    this.userWarning.comments = this.otherMessage;
    this.authApi.saveUserWarning(this.userWarning).subscribe({
      next: (res: APIResponseObject) => {
        if (res.result) {
          this.dialogRef.close();
        } else {
          this.tostr.error(res.message);
          this.isSubmitted = false;
        }
        this.isSubmitted = false;
      },
      error: (error: HttpErrorResponse) => {
        this.tostr.error(error.error.message);
        LoggerService.log('error=>', error);
        this.isSubmitted = false;
      },
    });
  }

  isGoBack(): boolean {
    return !this.goBack;
  }
}
