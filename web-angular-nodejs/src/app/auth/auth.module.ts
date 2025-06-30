import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegistrationClosedComponent } from './components/registration-closed/registration-closed.component';
import { SuccessfulRegistrationComponent } from './components/successful-registration/successful-registration.component';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { TermsAndConditionsDialogComponent } from './dialogs/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { UserWarningMessageDialogComponent } from './dialogs/user-warning-message-dialog/user-warning-message-dialog.component';
import { UserWarningMessageSubmitDialogComponent } from './dialogs/user-warning-message-submit-dialog/user-warning-message-submit-dialog.component';
import { AuthService } from './services/auth.service';
import { ForgotPasswordDialogComponent } from './dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    TermsAndConditionsDialogComponent,
    UserWarningMessageDialogComponent,
    UserWarningMessageSubmitDialogComponent,
    SuccessfulRegistrationComponent,
    ChangePasswordDialogComponent,
    RegistrationClosedComponent,
    ForgotPasswordDialogComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
