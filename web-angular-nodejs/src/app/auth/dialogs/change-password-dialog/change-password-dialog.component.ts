import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from '../../../core/services/logger.service';
import { ChangePasswordModel } from '../../../core/models/changePassword.model';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private tostr: ToastrService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.getUserEmailByUserId();
  }

  getUserEmailByUserId() {
    this.authService.getUserEmailByUserId().subscribe((response: APIResponseObject) => {
      if (response.result) {
        this.changePasswordForm.controls['email'].setValue(response.data);
      } else {
        this.tostr.error(response.message);
      }
    });
  }

  changePassword() {
    const changePasswordRequest: ChangePasswordModel = {
      email: this.changePasswordForm.controls['email'].value,
      oldPassword: this.changePasswordForm.controls['oldPassword'].value,
      password: this.changePasswordForm.controls['newPassword'].value?.trim(),
    };

    this.authService.changePassword(changePasswordRequest).subscribe(
      (res: APIResponseObject) => {
        if (res.result) {
          this.dialogRef.close();
          this.tostr.success(res.message.description);
        } else {
          this.tostr.error(res.message);
        }
      },
      (error: HttpErrorResponse) => {
        LoggerService.log('error=>', error);
      },
    );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  };
}
