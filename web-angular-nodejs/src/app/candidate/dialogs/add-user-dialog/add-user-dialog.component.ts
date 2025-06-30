import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RegistrationType } from '../../../core/enums/RegistrationType';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { AreaModel } from '../../../core/models/area.model';
import { DriveModel } from '../../../core/models/drive.model';
import { UserModel } from '../../../core/models/user.model';
import { LoggerService } from '../../../core/services/logger.service';
import { CandidateService } from '../../services/candidate.service';
import { environment } from '../../../../environments/environment';
import {
  AddUserConstants,
  DATE_FORMAT,
  emailRegex,
  emailRegexWithPlus,
  OptionConstants,
} from '../../../core/utils/constants';
import { AdminAddUserModel } from '../../models/admin-add-user.model';
import { GeneratePasswordModel } from '../../../auth/models/generatePassword.model';
import { FormControlVariables } from '../../../core/constants.ts/form-control-variables';
import { TimeFormates } from '../../../core/enums/DateTimeFormate';
import { HttpErrorResponse } from '@angular/common/http';
import { DriveAndUserDetailsModel } from '../../models/drive-and-user-details.model';
import { Status } from '../../../core/enums/Comman';
import { TosterMessages } from '../../../core/constants/messages';
import { AdminUpdateUserModel } from '../../models/admin-update-user.model';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loader: boolean = false;
  adddUserObject: UserModel = new UserModel();
  adminAddUserModel: AdminAddUserModel = new AdminAddUserModel();
  generatePasswordModel!: GeneratePasswordModel;
  currentDateSelected: boolean = false;
  editModeEnabled: boolean = false;
  regenerateButtonHidden: boolean = true;
  generateButtonHidden: boolean = false;
  driveList: DriveModel[] = [];
  driveData: DriveModel;
  areaList: AreaModel[] = [];
  editedByAdmin: boolean | undefined;
  headerName: string = '';
  submitted: boolean = false;
  disableTimePicker: boolean = false;
  disableButton: boolean = false;
  minDate: Date = new Date();
  showDuplicateErrorMessage: boolean = false;
  errorMessage: string = '';
  userAlreadyRegisterInAnotherDrive: boolean = false;
  formControlVariables = new FormControlVariables();

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriveAndUserDetailsModel,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private candidateService: CandidateService,
    private dialog: MatDialog,
  ) {
    this.driveList = data.driveList;
    this.editModeEnabled = data.edit;
    if (this.editModeEnabled) {
      this.loadAreas(data.userData.driveId);
    }
    this.driveData = data.driveData;
    if (data.userData != undefined) {
      this.adddUserObject = data.userData;
      this.adminAddUserModel.id = data.userData.id;
    }
    this.headerName = this.editModeEnabled
      ? 'Update ' + this.adddUserObject.firstName + ' ' + this.adddUserObject.lastName + ' Profile'
      : 'Add User';
  }

  addUserForm: FormGroup = this.formBuilder.group({
    userType: ['Examinee', [Validators.required]],
    firstName: [
      '',
      [Validators.required, Validators.pattern(/^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/)],
    ],
    lastName: ['', [Validators.required, Validators.pattern(/^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[\s]*[0-9]{10}[\s]*$/)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(environment.focusOutDisabled ? emailRegexWithPlus : emailRegex),
        Validators.minLength(0),
      ],
    ],
    password: ['', []],
    areaOfInterest: ['', [Validators.required]],
    drive: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    byPass: [false, []],
    currentDate: [false, []],
  });

  ngOnInit() {
    this.generatePasswordModel = new GeneratePasswordModel();
    if (this.editModeEnabled) {
      this.generateButtonHidden = true;

      this.addUserForm.patchValue({
        userType: 'Examinee',
        firstName: this.adddUserObject.firstName,
        lastName: this.adddUserObject.lastName,
        mobileNumber: this.adddUserObject.mobileNumber,
        email: this.adddUserObject.email,
        password: this.adddUserObject.password,
        areaOfInterest: this.adddUserObject.areaOfInterestId,
        drive: this.adddUserObject.driveId,
        date: this.adddUserObject.examStartTime.split(' ')[0],
        time: new Date(this.adddUserObject.examStartTime),
      });
      this.addUserForm.controls['email'].disable();
    } else {
      this.addUserForm.controls['drive'].patchValue(this.driveData.id);
      this.addUserForm.controls['drive'].disable();
      this.loadAreas(this.driveData.id);
    }
    this.candidateService.getCurrentDateTime().subscribe(
      (response: APIResponseObject) => {
        if (response.result) {
          this.minDate = new Date(response.data);
          this.minDate.setDate(this.minDate.getDate() - 0);
        }
      },
      (err: any) => {
        LoggerService.log('Error in get current time :::: ', err);
      },
    );
  }

  driveChanged(event: MatSelectChange) {
    this.addUserForm.patchValue({ areaOfInterest: '' });
    this.loadAreas(event.value);
  }

  loadAreas(driveId: number) {
    this.candidateService
      .getAreaOfInterestByDriveId([driveId])
      .subscribe((response: APIResponseObject) => {
        if (response.result) {
          this.areaList = response.data;
        } else {
          this.areaList = [];
        }
      });
  }

  getCurrentDate(event: MatCheckboxChange) {
    if (event.checked) {
      this.currentDateSelected = true;
      let newDate = new Date(this.minDate.getTime() + 300000);
      let hours: number = newDate.getHours();
      let minutes: string = newDate.getMinutes().toString();
      minutes = parseInt(minutes) < 10 ? '0' + minutes : minutes;
      this.addUserForm.controls['date'].reset(new Date().toISOString().split('T')[0]);
      this.addUserForm.controls['time'].reset(hours + ':' + minutes + ':00');
    } else {
      this.currentDateSelected = false;
      this.addUserForm.controls['date'].reset();
      this.addUserForm.controls['time'].reset();
    }
  }

  addDate(event: any) {
    let dateFormat = this.datePipe.transform(event.value, DATE_FORMAT);
    this.addUserForm.controls['date'].setValue(dateFormat);
  }

  generatePassword() {
    if (this.addUserForm.valid) {
      this.disableButton = true;
      this.generatePasswordModel.firstName = this.addUserForm.controls['firstName']?.value?.trim();
      this.generatePasswordModel.lastName = this.addUserForm.controls['lastName'].value?.trim();
      this.generatePasswordModel.email = this.addUserForm.controls['email'].value?.trim();
      this.generatePasswordModel.mobileNumber =
        this.addUserForm.controls['mobileNumber'].value?.trim();
      this.generatePasswordModel.driveId = this.addUserForm.controls['drive'].value;
      this.generatePasswordModel.bypass = this.addUserForm.controls['byPass'].value;
      this.generatePasswordModel.loginUser = 'Admin';
      this.generatePasswordModel.examDate = this.addUserForm.controls['date'].value;
      this.generatePasswordModel.examStartTime =
        this.addUserForm.controls['time'].value.length == 8
          ? this.addUserForm.controls['time'].value
          : moment(this.addUserForm.controls['time'].value).format('HH:mm:ss');
      this.loader = true;
      this.candidateService.generatePassword(this.generatePasswordModel).subscribe(
        (response: APIResponseObject) => {
          this.loader = false;
          if (response.result) {
            this.toastr.success('Password has been sent to your Email.');
            this.generateButtonHidden = true;
            this.regenerateButtonHidden = false;
            this.addUserForm.controls['userType'].disable();
            this.addUserForm.controls['email'].disable();
            this.addUserForm.controls['mobileNumber'].disable();
            this.addUserForm.controls['firstName'].disable();
            this.addUserForm.controls['lastName'].disable();
            this.addUserForm.controls['areaOfInterest'].disable();
            this.addUserForm.controls['date'].disable();
            this.disableTimePicker = true;
            this.addUserForm.controls['currentDate'].disable();
            this.addUserForm.controls['byPass'].disable();
            this.userAlreadyRegisterInAnotherDrive = false;
            this.errorMessage = response?.data?.message;
          } else {
            if (response?.data?.includes('You are already registered')) {
              this.errorMessage = response?.message?.message;
              this.userAlreadyRegisterInAnotherDrive = true;
            } else if (
              response?.data?.includes("Candidate's screening test is already scheduled") ||
              response.message?.message?.includes('User is not eligible')
            ) {
              this.showDuplicateErrorMessage = true;
              this.errorMessage = response?.message?.message;
            } else {
              this.toastr.error(response?.message?.message);
            }
          }
          this.disableButton = false;
        },
        (error: HttpErrorResponse) => {
          this.disableButton = false;
          this.loader = false;
          if (error.status === 400) {
            const message = error?.error?.message?.generatePasswordRequest ?? error?.error?.message;
            this.toastr.error(message);
          }
          LoggerService.log('error==>', error);
        },
      );
    } else {
      this.addUserForm.markAllAsTouched();
      this.toastr.error('Please fill all the details.');
    }
  }

  onSubmit() {
    if (this.editModeEnabled && this.editedByAdmin === undefined) {
      this.toastr.error(AddUserConstants.SelectValidReason);
      return;
    }

    this.handleUserAction();
  }

  generatePayload() {
    this.disableButton = true;
    this.adminAddUserModel.userType =
      this.addUserForm.controls[this.formControlVariables.userType].value;
    this.adminAddUserModel.firstName =
      this.addUserForm.controls[this.formControlVariables.firstName].value?.trim();
    this.adminAddUserModel.lastName =
      this.addUserForm.controls[this.formControlVariables.lastName].value?.trim();
    this.adminAddUserModel.mobileNumber =
      this.addUserForm.controls[this.formControlVariables.mobile].value?.trim();
    this.adminAddUserModel.email =
      this.addUserForm.controls[this.formControlVariables.email].value?.trim();
    this.adminAddUserModel.password =
      this.addUserForm.controls[this.formControlVariables.password].value;
    this.adminAddUserModel.areaOfInterestId =
      this.addUserForm.controls[this.formControlVariables.areaOfInterest].value;
    this.adminAddUserModel.driveId =
      this.addUserForm.controls[this.formControlVariables.drive].value;
    this.adminAddUserModel.userStatus = Status.Active;
    this.adminAddUserModel.loginStatus = Status.Inactive;
    this.adminAddUserModel.currentDate =
      this.addUserForm.controls[OptionConstants.CurrentDate].value;
    this.adminAddUserModel.bypass = this.addUserForm.controls[OptionConstants.ByPass].value;
    this.adminAddUserModel.examDate =
      this.addUserForm.controls[this.formControlVariables.date].value;
    this.adminAddUserModel.examStartTime =
      this.addUserForm.controls[this.formControlVariables.time].value.length === 8
        ? this.addUserForm.controls[this.formControlVariables.time].value
        : moment(this.addUserForm.controls[this.formControlVariables.time].value).format(
            TimeFormates.HH_MM_SS,
          );
    this.adminAddUserModel.editedbyAdmin = this.editedByAdmin ?? false;
    this.adminAddUserModel.registrationType = RegistrationType.ADMIN_REGISTRATION;
  }

  handleUserAction(): void {
    if (!this.addUserForm.valid) {
      this.toastr.error(TosterMessages.PleaseFillAllDetails);
      return;
    }

    this.generatePayload();
    const userAction =
      this.editModeEnabled && this.editedByAdmin
        ? this.candidateService.updateUser(new AdminUpdateUserModel(this.adminAddUserModel))
        : this.candidateService.addUser(this.adminAddUserModel);
    userAction.subscribe({
      next: (response: APIResponseObject) => {
        if (response.result) {
          const message = response?.message.description || response.message;
          this.toastr.success(message);
          this.dialogRef.close(true);
        } else {
          const errorMessage = response?.message.description || response.message;
          this.toastr.error(errorMessage);
        }
        this.disableButton = false;
      },
      error: (error: HttpErrorResponse) => {
        this.disableButton = false;
        const message = error?.error?.message?.description ?? error?.error?.message;
        this.toastr.error(message);
        LoggerService.log('error==>', error);
      },
    });
  }

  onSelectReason(event: MatRadioChange) {
    this.editedByAdmin = Boolean(event.value);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addUserForm.controls[controlName].hasError(errorName);
  };

  editFormDetails() {
    this.generateButtonHidden = false;
    this.addUserForm.controls['userType'].enable();
    this.addUserForm.controls['email'].enable();
    this.addUserForm.controls['mobileNumber'].enable();
    this.addUserForm.controls['firstName'].enable();
    this.addUserForm.controls['lastName'].enable();
    this.addUserForm.controls['areaOfInterest'].enable();
    this.addUserForm.controls['date'].enable();
    this.disableTimePicker = false;
    this.addUserForm.controls['currentDate'].enable();
    this.addUserForm.controls['byPass'].enable();
    this.addUserForm.controls['password'].reset('');
    this.errorMessage = '';
  }

  removeDuplicateErrorMessage(): void {
    this.showDuplicateErrorMessage = false;
    this.userAlreadyRegisterInAnotherDrive = false;
  }

  userAlreadyRegisteredGeneratePassword(): void {
    this.addUserForm.controls['byPass'].setValue(true);
    this.generatePassword();
  }
}
