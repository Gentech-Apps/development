import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Regex } from '../../../core/constants/regex';
import { AuthService } from '../../services/auth.service';
import { ResetPassword } from '../../models/resetPassword.model';
import { environment } from '../../../../environments/environment';
import { APIResponseObject } from '../../../core/response/apiResponseObject';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
})
export class ForgotPasswordDialogComponent {
  isVerified: boolean = false;
  otpSended: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toasterService: ToastrService,
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
  ) {}

  resetPasswordFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(Regex.Email)]],
  });

  hasError(controlName: string, errorName: string) {
    return (
      this.resetPasswordFormGroup.controls[controlName].hasError(errorName) &&
      this.resetPasswordFormGroup.controls[controlName].touched
    );
  }

  sendResetPasswordMail() {
    if (this.resetPasswordFormGroup.valid) {
      const resetPasswordModel = new ResetPassword();
      resetPasswordModel.email = this.resetPasswordFormGroup.get('email')?.value ?? '';
      resetPasswordModel.baseUrl = environment.baseUrl;
      this.authService
        .sendEmailForResetPassword(resetPasswordModel)
        .subscribe((response: APIResponseObject) => {
          if (response.result) {
            this.toasterService.success(response.message);
            this.dialogRef.close();
          } else {
            this.toasterService.error(response.message);
          }
        });
    } else {
      this.resetPasswordFormGroup.markAllAsTouched();
    }
  }
}
