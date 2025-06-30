import { Component } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { LoggerService } from '../../../core/services/logger.service';
import { AuthService } from '../../services/auth.service';
import { Regex } from '../../../core/constants/regex';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  userEmail: string = '';
  passwordMatched: boolean = false;
  decodedValue: string[] = [];
  userId: number = 0;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  changePasswordForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', Validators.required),
      newPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(Regex.Password),
          Validators.maxLength(40),
        ]),
      ),
      confirmPassword: new FormControl('', Validators.required),
    },
    this.matchPassword,
  );

  constructor(
    private toaster: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.changePasswordForm.controls['email'].disable();

    this.route.queryParams.subscribe((data) => {
      this.decodedValue = atob(data['data']).split(',');
      this.userId = Number(this.decodedValue[1].trim());
      this.userEmail = this.decodedValue[0].trim();
    });

    this.authService.getUserDetails(this.userId).subscribe((response: APIResponseObject) => {
      if (response.result) {
        const userData: UserModel = response.data;
        if (userData.email === this.userEmail) {
          this.changePasswordForm.controls['email'].setValue(this.userEmail);
        }
      } else {
        this.toaster.error('Invalid URL');
        this.router.navigate(['']);
      }
    });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const userModel: UserModel = new UserModel();
      userModel.email = this.changePasswordForm.controls['email'].value;
      userModel.password = this.changePasswordForm.controls['newPassword'].value;

      this.authService.resetPassword(userModel).subscribe(
        (res: APIResponseObject) => {
          if (res.result) {
            this.toaster.success(res.message);
            this.router.navigate(['/login']);
          } else {
            this.toaster.error(res.message);
          }
        },
        (error: Error) => {
          LoggerService.log('error=>', error);
        },
      );
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  };

  matchPassword(formGroup: AbstractControl) {
    const newPassword = formGroup.get('newPassword')?.value;
    if (formGroup.get('confirmPassword')?.touched || formGroup.get('confirmPassword')?.dirty) {
      const verifyPassword = formGroup.get('confirmPassword')?.value;
      if (newPassword != verifyPassword) {
        formGroup.get('confirmPassword')?.setErrors({ matchPassword: true });
      } else {
        return null;
      }
    }
    return null;
  }
}
