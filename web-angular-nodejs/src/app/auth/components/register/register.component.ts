import { DatePipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from 'node_modules/@angular/material/datepicker';
import { publicIpv4 } from 'public-ip';
import { TimeSlot } from 'src/app/add-drive/models/timeSlot.model';
import { AreaModel } from '../../../core/models/area.model';
import { DriveModel } from '../../../core/models/drive.model';
import { UserModel } from '../../../core/models/user.model';
import { APIResponseObject } from '../../../core/response/apiResponseObject';
import { ApiService } from '../../../core/services/api.service';
import { checkIPService } from '../../../core/services/checkIP.service';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { LoggerService } from '../../../core/services/logger.service';
import {
  DATE_FORMAT,
  DialogMessages,
  IconNames,
  MessageDialogButtonNames,
  MessageDialogTitles,
  PaperTypes,
  emailRegex,
  emailRegexWithPlus,
} from '../../../core/utils/constants';
import { TermsAndConditionsDialogComponent } from '../../dialogs/terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { InstructionsModel } from '../../models/instructions.model';
import { RegistrationFields } from '../../models/registrationFields.model';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../../environments/environment';
import { MessageDialogComponent } from '../../../core/dialog/message-dialog/message-dialog.component';
import { messageDialog } from '../../../core/models/messageDialog';
import { UserTypes } from '../../../core/enums/UserType';
import { UserRegistrationModel } from '../../models/userRegistration.model';
import { GeneratePasswordModel } from '../../models/generatePassword.model';
import { format, parse } from 'date-fns';
import { TimeFormates } from '../../../core/enums/DateTimeFormate';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControlVariables } from '../../../core/constants.ts/form-control-variables';
import { PLEASE_FILL_ALL_DETAILS } from '../../constants/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  formConstants: FormControlVariables = new FormControlVariables();
  user: UserModel = new UserModel();
  userRegistrationModel: UserRegistrationModel = new UserRegistrationModel();
  holidayList: number[] = [];
  sourceFromQueryParams: string = '';
  driveData: DriveModel = new DriveModel();
  activeDriveData!: DriveModel;
  activeRegistrationDriveData: DriveModel = new DriveModel();
  areaList: AreaModel[] = [];
  activeDriveAreaList: AreaModel[] = [];
  activeRegistrationDriveAreaList: AreaModel[] = [];
  minDate!: Date;
  maxDate!: Date;
  publicIp: string = '';
  showPasswordButton: boolean = false;
  disablePasswordButton: boolean = false;
  registrationFields!: RegistrationFields;
  showValidation: boolean = false;
  isRender: boolean = false;
  disableDateTimeField: boolean = false;
  currentDateSelected: boolean = false;
  examEndTime: string = '';
  photoFile: File | undefined;
  previouslySelectedPhotoFile: File | undefined;
  resumeFile: File | undefined;
  previouslySelectedResumeFile: File | undefined;
  isGenerateButtonHidden: boolean = false;
  isRegenerateButtonHidden: boolean = false;
  finishRegistration: boolean = false;
  showLoader: boolean = false;
  requiredTNC: boolean = false;
  qualificationList: any[] = [];
  showObjectiveInstructions: boolean = false;
  showSubjectiveInstructions: boolean = false;
  instructionsList: InstructionsModel[] = [];
  objectiveList: InstructionsModel[] = [];
  subjectiveList: InstructionsModel[] = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  showOtherQualificationField: boolean = false;
  timeSlots: TimeSlot[] = [];
  activeRegistrationDriveQualificationList: any[] = [];
  activeLoginDriveQualificationList: any[] = [];
  activeRegistrationDriveTimeSlots: TimeSlot[] = [];
  activeLoginDriveTimeSlots: TimeSlot[] = [];
  isSubmitted: boolean = false;
  isEditingDisabled: boolean = false;
  skipDuplicateUser: boolean = false;
  paperType: typeof PaperTypes = PaperTypes;
  currentDate: string[] = [];
  userType: string = UserTypes.EXAMINEE;
  generatePasswordModel!: GeneratePasswordModel;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private api: ApiService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private session: SessionService,
    private ipService: checkIPService,
  ) {
    this.epicFunction();
  }

  registerUserForm: FormGroup = this.formBuilder.group({
    firstName: [
      '',
      [Validators.required, Validators.pattern(/^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/)],
    ],
    lastName: ['', [Validators.required, Validators.pattern(/^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(environment.focusOutDisabled ? emailRegexWithPlus : emailRegex),
      ],
    ],
    contactNumber: ['', [Validators.required, Validators.pattern(/^[\s]*[0-9]{10}[\s]*$/)]],
    password: [''],
    fieldOfInterest: ['', Validators.required],
    driveId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    profile: ['', Validators.required],
    resume: ['', Validators.required],
    qualification: ['', Validators.required],
    otherQualification: [''],
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^[\s]*[0-9]{10}[\s]*$/)]],
    location: [
      '',
      [Validators.required, Validators.pattern(/[\s]*[a-zA-Z]+[a-zA-Z\d\s\-\,\#\.\+]*[\s]*/)],
    ],
    tnc: [false, Validators.requiredTrue],
    source: [''],
  });

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const time = d?.getTime();
    return day !== 0 && day !== 6 && !this.holidayList.find((x: number | undefined) => x == time);
  };

  async ngOnInit() {
    await this.getPublicIP();
    this.generatePasswordModel = new GeneratePasswordModel();
    this.route.queryParams.subscribe((data: any) => {
      let encodedValue = data['data'];
      if (encodedValue) {
        this.sourceFromQueryParams = atob(data['data']);
      }
    });

    this.authService
      .getRegistrationPageDetails(this.publicIp)
      .subscribe((response: APIResponseObject) => {
        if (response.result) {
          this.currentDate = response.data.dates;
          const isRegistrationOpen = response.data?.activeDriveRecord?.registrationOpen;
          if (
            response.data?.activeDriveRecord?.loginType == 'IP' &&
            response.data?.activeDriveRecord?.registrationType == 'IP' &&
            isRegistrationOpen == false
          ) {
            this.router.navigate(['/registration-closed']);
          } else {
            this.activeDriveData = response.data.activeDriveRecord;
            this.activeRegistrationDriveData = response.data.activeRegistrationDriveRecord;
            this.activeDriveAreaList = response.data.activeDriveAreaList;
            this.activeRegistrationDriveAreaList = response.data.activeRegistrationAreaList;
            this.instructionsList = response.data.instructionsList;
            this.activeRegistrationDriveQualificationList =
              response.data.activeRegistrationDriveQualificationList;
            this.activeLoginDriveQualificationList =
              response.data.activeLoginDriveQualificationList;
            this.activeRegistrationDriveTimeSlots = response.data.activeRegistrationDriveTimeSlots;
            this.activeLoginDriveTimeSlots = response.data.activeLoginDriveTimeSlots;

            this.instructionsList.forEach((instruction) => {
              instruction.paperTypeId == this.paperType.OBJECTIVE
                ? this.objectiveList.push(instruction)
                : this.subjectiveList.push(instruction);
            });

            let dates: Date[] = response.data.dates;
            let newDate: Date = dates[0];
            newDate = new Date(newDate);
            this.minDate = new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate() + 1,
            );
            this.maxDate = new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate() + 15,
            );
            this.renderRegistrationForm();
            this.holidayList = response.data.holidayList;
          }
        } else {
          LoggerService.log('Logger Service ::::: ', response.message);
          this.router.navigate(['/registration-closed']);
        }
      });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
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

  epicFunction() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    if (isMobile || isTablet) {
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

  async getPublicIP() {
    await publicIpv4().then((ip: string) => {
      this.publicIp = ip;
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.registerUserForm.controls[controlName].hasError(errorName);
  };

  showMoreInstructions(option: string) {
    option == 'objective'
      ? (this.showObjectiveInstructions = true)
      : (this.showSubjectiveInstructions = true);
  }

  async renderRegistrationForm() {
    if (
      ((this.activeDriveData == null || this.activeDriveData == undefined) &&
        (this.activeRegistrationDriveData == null ||
          this.activeRegistrationDriveData == undefined)) ||
      this.activeRegistrationDriveData == null ||
      this.activeRegistrationDriveData == undefined
    ) {
      this.router.navigate(['/registration-closed']);
      return;
    }
    if (JSON.stringify(this.activeDriveData) == JSON.stringify(this.activeRegistrationDriveData)) {
      if (this.activeDriveData?.registrationType == 'Global') {
        this.assignRegistrationFormData(
          this.activeDriveData.formFields,
          this.activeDriveAreaList,
          this.activeDriveData,
          this.activeLoginDriveQualificationList,
          this.activeLoginDriveTimeSlots,
        );
        return;
      } else {
        let validIP = await this.ipService.checkIP(this.activeDriveData?.registrationIP.split(','));
        if (validIP) {
          this.assignRegistrationFormData(
            this.activeDriveData?.formFields,
            this.activeDriveAreaList,
            this.activeDriveData,
            this.activeLoginDriveQualificationList,
            this.activeLoginDriveTimeSlots,
          );
          return;
        } else {
          this.router.navigate(['/registration-closed']);
          return;
        }
      }
    } else {
      if (this.activeDriveData == null || this.activeDriveData == undefined) {
        // when toggle is on only for registration ....................
        if (this.activeRegistrationDriveData.registrationType == 'Global') {
          this.assignRegistrationFormData(
            this.activeRegistrationDriveData.formFields,
            this.activeRegistrationDriveAreaList,
            this.activeRegistrationDriveData,
            this.activeRegistrationDriveQualificationList,
            this.activeRegistrationDriveTimeSlots,
          );
          return;
        } else {
          let validIP = await this.ipService.checkIP(
            this.activeRegistrationDriveData.registrationIP.split(','),
          );
          if (validIP) {
            this.assignRegistrationFormData(
              this.activeRegistrationDriveData.formFields,
              this.activeRegistrationDriveAreaList,
              this.activeRegistrationDriveData,
              this.activeRegistrationDriveQualificationList,
              this.activeRegistrationDriveTimeSlots,
            );
            return;
          } else {
            const messageDialogData = new messageDialog(
              MessageDialogTitles.ErrorInRegistration,
              DialogMessages.PleaseContactWithHR,
              IconNames.HighlightOff,
              true,
              false,
              MessageDialogButtonNames.Yes,
            );
            const config: MatDialogConfig = {
              width: '570px',
              height: '360px',
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog.open(MessageDialogComponent, config);
            return;
          }
        }
      } else {
        if (
          this.activeDriveData?.registrationType == 'Global' &&
          this.activeRegistrationDriveData.registrationType == 'Global'
        ) {
          if (this.activeDriveData.loginType == 'IP') {
            let validIP = await this.ipService.checkIP(this.activeDriveData.loginIP.split(','));
            if (validIP) {
              this.assignRegistrationFormData(
                this.activeDriveData.formFields,
                this.activeDriveAreaList,
                this.activeDriveData,
                this.activeLoginDriveQualificationList,
                this.activeLoginDriveTimeSlots,
              );
              return;
            } else {
              this.assignRegistrationFormData(
                this.activeRegistrationDriveData.formFields,
                this.activeRegistrationDriveAreaList,
                this.activeRegistrationDriveData,
                this.activeRegistrationDriveQualificationList,
                this.activeRegistrationDriveTimeSlots,
              );
              return;
            }
          } else {
            this.assignRegistrationFormData(
              this.activeRegistrationDriveData.formFields,
              this.activeRegistrationDriveAreaList,
              this.activeRegistrationDriveData,
              this.activeRegistrationDriveQualificationList,
              this.activeRegistrationDriveTimeSlots,
            );
            return;
          }
        } else {
          if (
            this.activeDriveData?.registrationType !=
            this.activeRegistrationDriveData.registrationType
          ) {
            if (this.activeDriveData?.registrationType == 'IP') {
              let validIP = await this.ipService.checkIP(
                this.activeDriveData.registrationIP.split(','),
              );
              if (validIP) {
                this.assignRegistrationFormData(
                  this.activeDriveData.formFields,
                  this.activeDriveAreaList,
                  this.activeDriveData,
                  this.activeLoginDriveQualificationList,
                  this.activeLoginDriveTimeSlots,
                );
                return;
              } else {
                this.assignRegistrationFormData(
                  this.activeRegistrationDriveData.formFields,
                  this.activeRegistrationDriveAreaList,
                  this.activeRegistrationDriveData,
                  this.activeRegistrationDriveQualificationList,
                  this.activeRegistrationDriveTimeSlots,
                );
                return;
              }
            } else {
              let validIP = await this.ipService.checkIP(
                this.activeRegistrationDriveData.registrationIP.split(','),
              );
              if (validIP) {
                this.assignRegistrationFormData(
                  this.activeRegistrationDriveData.formFields,
                  this.activeRegistrationDriveAreaList,
                  this.activeRegistrationDriveData,
                  this.activeRegistrationDriveQualificationList,
                  this.activeRegistrationDriveTimeSlots,
                );
                return;
              } else {
                this.assignRegistrationFormData(
                  this.activeDriveData?.formFields,
                  this.activeDriveAreaList,
                  this.activeDriveData,
                  this.activeLoginDriveQualificationList,
                  this.activeLoginDriveTimeSlots,
                );
                return;
              }
            }
          } else {
            // both are IP
            let validIP = await this.ipService.checkIP(
              this.activeDriveData.registrationIP.split(','),
            );
            if (validIP) {
              this.assignRegistrationFormData(
                this.activeDriveData.formFields,
                this.activeDriveAreaList,
                this.activeDriveData,
                this.activeLoginDriveQualificationList,
                this.activeLoginDriveTimeSlots,
              );
              return;
            } else {
              let validIP = await this.ipService.checkIP(
                this.activeRegistrationDriveData.registrationIP.split(','),
              );
              if (validIP) {
                this.assignRegistrationFormData(
                  this.activeRegistrationDriveData.formFields,
                  this.activeRegistrationDriveAreaList,
                  this.activeRegistrationDriveData,
                  this.activeRegistrationDriveQualificationList,
                  this.activeRegistrationDriveTimeSlots,
                );
                return;
              } else {
                const messageDialogData = new messageDialog(
                  MessageDialogTitles.ErrorInRegistration,
                  DialogMessages.PleaseContactWithHR,
                  IconNames.HighlightOff,
                  true,
                  false,
                  MessageDialogButtonNames.Yes,
                );
                const config: MatDialogConfig = {
                  width: '570px',
                  height: '360px',
                  disableClose: true,
                  data: messageDialogData,
                };
                this.dialog.closeAll();
                this.dialog.open(MessageDialogComponent, config);
                return;
              }
            }
          }
        }
      }
    }
  }

  assignRegistrationFormData(
    regFormsFields: string,
    categories: AreaModel[],
    driveData: DriveModel,
    qualificationList: any[],
    timeSlots: TimeSlot[],
  ) {
    if (this.checkExamDate(driveData)) {
      this.registrationFields = JSON.parse(regFormsFields);
      this.areaList = categories;
      this.driveData = driveData;
      this.registerUserForm.controls['driveId'].setValue(this.driveData.id);
      this.qualificationList = qualificationList;
      this.timeSlots = timeSlots;
      this.removeValidations();
    } else {
      this.router.navigate(['/registration-closed']);
    }
  }

  removeValidations() {
    if (this.driveData.registrationType == 'IP') {
      this.getCurrentDateTime();
      this.currentDateSelected = true;
      this.disableDateTimeField = true;
    } else {
      if (this.driveData.driveDate != null) {
        this.setValueToFormControl('date', this.driveData.driveDate);
        this.disableDateTimeField = true;
      }

      if (this.driveData.startTime != 'Invalid date') {
        this.setValueToFormControl('time', this.driveData.startTime);
        this.examEndTime = this.driveData.endTime ? this.driveData.endTime : '';
      }
    }

    if (!this.registrationFields.profile) {
      this.removeFormValidators('profile');
    }
    if (!this.registrationFields.resume) {
      this.removeFormValidators('resume');
    }
    if (!this.registrationFields.qualification) {
      this.removeFormValidators('qualification');
    }
    if (!this.registrationFields.whatsappNumber) {
      this.removeFormValidators('whatsappNumber');
    }
    if (!this.registrationFields.location) {
      this.removeFormValidators('location');
    }
    if (this.registrationFields.source) {
      this.registerUserForm.controls['source'].addValidators(Validators.required);
      let value: string = this.sourceFromQueryParams != '' ? this.sourceFromQueryParams : 'other';
      this.registerUserForm.controls['source'].setValue(value);
    }

    this.isRender = true;
  }

  removeFormValidators(controlName: string) {
    this.registerUserForm.controls[controlName].removeValidators(Validators.required);
    this.registerUserForm.controls[controlName].reset();
    this.registerUserForm.controls[controlName].setValue('');
  }

  setValueToFormControl(controlName: string, value: string | null) {
    this.registerUserForm.controls[controlName].reset();
    this.registerUserForm.controls[controlName].setValue(value);
  }

  getCurrentDateTime() {
    let examDate: string | null = new Date().toISOString().split('T')[0];
    examDate = this.datePipe.transform(examDate, DATE_FORMAT);
    let date = new Date();
    let newDate = new Date(date.getTime() + 300000);
    let hours: string = newDate.getHours().toString();
    let minutes: string = newDate.getMinutes().toString();
    minutes = Number(minutes) < 10 ? '0' + minutes : minutes;
    let examTime = hours + ':' + minutes + ':' + '00';
    this.registerUserForm.controls['date'].reset(examDate);
    this.registerUserForm.controls['time'].reset(examTime);
  }

  onSelectExamDate(event: MatDatepickerInputEvent<Date>) {
    let examDate = this.datePipe.transform(event.value, DATE_FORMAT);
    this.registerUserForm.controls['date'].reset(examDate);
  }

  handleProfileChange(list: FileList | null) {
    this.showValidation = true;
    if (list && list.length > 0) {
      this.photoFile = list[0];
      this.previouslySelectedPhotoFile = this.photoFile;
      let name = this.photoFile.name;
      this.registerUserForm.controls['profile'].patchValue(name);
      let photoExtention = name.substr(name.lastIndexOf('.') + 1);
      let size = Math.round(this.photoFile.size / 1024);
      if (photoExtention !== 'png') {
        this.registerUserForm.controls['profile'].setErrors({ invalidType: true });
      } else if (size > 2048) {
        this.registerUserForm.controls['profile'].setErrors({ invalidSize: true });
      } else {
        this.registerUserForm.controls['profile'].setErrors(null);
      }
    } else {
      if (this.previouslySelectedPhotoFile === undefined) {
        this.registerUserForm.controls['profile'].patchValue('');
      } else {
        this.registerUserForm.controls['profile'].patchValue(this.previouslySelectedPhotoFile.name);
        let photoExtention = this.previouslySelectedPhotoFile.name.substr(
          this.previouslySelectedPhotoFile.name.lastIndexOf('.') + 1,
        );
        let size = Math.round(this.previouslySelectedPhotoFile.size / 1024);
        if (photoExtention !== 'png') {
          this.registerUserForm.controls['profile'].setErrors({ invalidType: true });
        } else if (size > 2048) {
          this.registerUserForm.controls['profile'].setErrors({ invalidSize: true });
        } else {
          this.registerUserForm.controls['profile'].setErrors(null);
        }
      }
    }
  }

  handleResumeChange(list: FileList | null) {
    this.showValidation = true;
    if (list && list.length > 0) {
      this.resumeFile = list[0];
      this.previouslySelectedResumeFile = this.resumeFile;
      let file_name: string = this.resumeFile.name;
      this.registerUserForm.controls['resume'].patchValue(file_name);
      let resumeExtention = file_name.substring(file_name.lastIndexOf('.') + 1);
      let size = Math.round(this.resumeFile.size / 1024);
      if (resumeExtention !== 'pdf') {
        this.registerUserForm.controls['resume'].setErrors({ invalidType: true });
      } else if (size < 20) {
        this.registerUserForm.controls['resume'].setErrors({ invalidMinSize: true });
      } else if (size > 2048) {
        this.registerUserForm.controls['resume'].setErrors({ invalidMaxSize: true });
      } else {
        this.registerUserForm.controls['resume'].setErrors(null);
      }
    } else {
      if (this.previouslySelectedResumeFile === undefined) {
        this.registerUserForm.controls['resume'].patchValue('');
      } else {
        this.registerUserForm.controls['resume'].patchValue(this.previouslySelectedResumeFile.name);
        let resumeExtention = this.previouslySelectedResumeFile.name.substr(
          this.previouslySelectedResumeFile.name.lastIndexOf('.') + 1,
        );
        let size = Math.round(this.previouslySelectedResumeFile.size / 1024);
        if (resumeExtention !== 'pdf') {
          this.registerUserForm.controls['resume'].setErrors({ invalidType: true });
        } else if (size < 20) {
          this.registerUserForm.controls['resume'].setErrors({ invalidMinSize: true });
        } else if (size > 2048) {
          this.registerUserForm.controls['resume'].setErrors({ invalidMaxSize: true });
        } else {
          this.registerUserForm.controls['resume'].setErrors(null);
        }
      }
    }
  }

  disableFormFieldsOnPasswordCreate() {
    this.isEditingDisabled = true;
    this.registerUserForm.controls['firstName'].disable();
    this.registerUserForm.controls['lastName'].disable();
    this.registerUserForm.controls['email'].disable();
    this.registerUserForm.controls['contactNumber'].disable();
    this.registerUserForm.controls['fieldOfInterest'].disable();
    this.registerUserForm.controls['driveId'].disable();
    this.registerUserForm.controls['date'].disable();
    this.registerUserForm.controls['time'].disable();
    this.registerUserForm.controls['profile'].disable();
    this.registerUserForm.controls['resume'].disable();
    this.registerUserForm.controls['qualification'].disable();
    this.registerUserForm.controls['otherQualification'].disable();
    this.registerUserForm.controls['whatsappNumber'].disable();
    this.registerUserForm.controls['location'].disable();
    this.registerUserForm.controls['tnc'].disable();
  }

  async generatePassword(type: string) {
    this.isSubmitted = true;
    this.requiredTNC = true;

    if (!this.checkInternetConnectivity()) return;

    try {
      await this.getPublicIP();
    } catch (e) {
      this.isSubmitted = false;
      this.showLoader = false;
      this.disablePasswordButton = false;
    }
    if (type == 'regeneratePasswordButton') {
      this.removeFormValidators('password');
    }
    if (!this.registerUserForm.valid) {
      this.isSubmitted = false;
      this.registerUserForm.markAllAsTouched();
      this.showPasswordButton = false;
      this.toastr.error('Please fill all the details.');
      return;
    } else {
      this.showLoader = true;
      this.disablePasswordButton = true;
      this.generatePasswordModel.email =
        this.registerUserForm.controls[this.formConstants.email].value?.trim();
      this.generatePasswordModel.mobileNumber =
        this.registerUserForm.controls[this.formConstants.contactNumber].value?.trim();
      this.generatePasswordModel.driveId = this.driveData.id;
      this.generatePasswordModel.publicIp = this.publicIp;
      this.generatePasswordModel.firstName =
        this.registerUserForm.controls[this.formConstants.firstName].value?.trim();
      this.generatePasswordModel.lastName =
        this.registerUserForm.controls[this.formConstants.lastName].value?.trim();
      this.generatePasswordModel.examDate =
        this.registerUserForm.controls[this.formConstants.date].value;
      this.generatePasswordModel.examStartTime = this.disableDateTimeField
        ? this.registerUserForm.controls[this.formConstants.time].value
        : format(
            parse(
              this.registerUserForm.controls[this.formConstants.time].value,
              TimeFormates.HH_MM,
              new Date(),
            ),
            TimeFormates.HH_MM_SS,
          );
      this.generatePasswordModel.loginUser = this.userType;
      this.generatePasswordModel.bypass = this.skipDuplicateUser;
      this.authService.examineeEmailVerification(this.generatePasswordModel).subscribe(
        (data: APIResponseObject) => {
          this.showLoader = false;
          this.isSubmitted = false;
          if (data.result) {
            this.toastr.success('Password has been sent to your Email.');
            this.disableFormFieldsOnPasswordCreate();
            this.disablePasswordButton = false;
            if (type == 'generatePasswordButton') {
              this.registerUserForm.controls['password'].reset('');
              this.registerUserForm.controls['password'].setValidators(Validators.required);
              this.showPasswordButton = true;
              this.isGenerateButtonHidden = false;
              this.isRegenerateButtonHidden = true;
            } else {
              this.registerUserForm.controls['password'].reset('');
              this.isGenerateButtonHidden = false;
              this.isRegenerateButtonHidden = true;
            }
          } else {
            this.disablePasswordButton = false;

            if (data?.message?.message.includes('You are already registered')) {
              const messageDialogData = new messageDialog(
                data.message.title,
                data.message.message,
                data.message.icon,
                true,
                true,
                MessageDialogButtonNames.ContinueRegistration,
                MessageDialogButtonNames.CancelRegistration,
              );
              const config: MatDialogConfig = {
                width: data.message.width,
                height: data.message.height,
                disableClose: true,
                data: messageDialogData,
              };
              this.dialog.closeAll();
              this.dialog
                .open(MessageDialogComponent, config)
                .afterClosed()
                .subscribe((result) => {
                  if (result) {
                    this.skipDuplicateUser = true;
                    this.generatePassword('generatePasswordButton');
                  } else {
                    this.router.navigate(['']);
                  }
                });
            } else if (data?.message?.message.includes('already scheduled for you')) {
              const messageDialogData = new messageDialog(
                data.message.title,
                data.message.message,
                data.message.icon,
                true,
                false,
                MessageDialogButtonNames.OK,
              );
              const config: MatDialogConfig = {
                width: data.message.width,
                height: data.message.height,
                disableClose: true,
                data: messageDialogData,
              };
              this.dialog.closeAll();
              this.dialog.open(MessageDialogComponent, config).afterClosed();
            } else {
              this.toastr.error(data?.message?.message);
            }
            return;
          }
        },
        (error: HttpErrorResponse) => {
          this.isSubmitted = false;
          this.showLoader = false;
          this.disablePasswordButton = false;
          const err = error.error;
          if (error.status === 400) {
            for (const property in err.message) {
              this.toastr.error(err.message[property], property);
            }
            return;
          }
          if (err?.message?.message.includes('You are already registered')) {
            const messageDialogData = new messageDialog(
              err.message.title,
              err.message.message,
              err.message.icon,
              true,
              true,
              MessageDialogButtonNames.ContinueRegistration,
              MessageDialogButtonNames.CancelRegistration,
            );
            const config: MatDialogConfig = {
              width: err.message.width,
              height: err.message.height,
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog
              .open(MessageDialogComponent, config)
              .afterClosed()
              .subscribe((result) => {
                if (result) {
                  this.skipDuplicateUser = true;
                  this.generatePassword(this.formConstants.generatePasswordButton);
                } else {
                  this.router.navigate(['']);
                }
              });
          } else if (err?.message?.message.includes('already scheduled for you')) {
            const messageDialogData = new messageDialog(
              err.message.title,
              err.message.message,
              err.message.icon,
              true,
              false,
              MessageDialogButtonNames.OK,
            );
            const config: MatDialogConfig = {
              width: err.message.width,
              height: err.message.height,
              disableClose: true,
              data: messageDialogData,
            };
            this.dialog.closeAll();
            this.dialog.open(MessageDialogComponent, config).afterClosed();
          } else {
            this.toastr.error(err?.message?.message);
          }
        },
      );
    }
  }

  onEditForm() {
    if (this.checkInternetConnectivity()) {
      this.showPasswordButton = false;
      this.finishRegistration = false;
      this.removeFormValidators(this.formConstants.password);
      this.isEditingDisabled = false;
      this.registerUserForm.controls[this.formConstants.firstName].enable();
      this.registerUserForm.controls[this.formConstants.lastName].enable();
      this.registerUserForm.controls[this.formConstants.email].enable();
      this.registerUserForm.controls[this.formConstants.contactNumber].enable();
      this.registerUserForm.controls[this.formConstants.fieldOfInterest].enable();
      this.registerUserForm.controls[this.formConstants.driveId].enable();
      this.registerUserForm.controls[this.formConstants.date].enable();
      this.registerUserForm.controls[this.formConstants.time].enable();
      this.registerUserForm.controls[this.formConstants.profile].enable();
      this.registerUserForm.controls[this.formConstants.resume].enable();
      this.registerUserForm.controls[this.formConstants.qualification].enable();
      this.registerUserForm.controls[this.formConstants.otherQualification].enable();
      this.registerUserForm.controls[this.formConstants.whatsappNumber].enable();
      this.registerUserForm.controls[this.formConstants.location].enable();
      this.registerUserForm.controls[this.formConstants.tnc].enable();
    }
  }

  register() {
    if (!this.registerUserForm.valid) {
      this.registerUserForm.markAllAsTouched();
      this.toastr.error(PLEASE_FILL_ALL_DETAILS);
      return;
    } else {
      if (this.checkInternetConnectivity()) {
        this.finishRegistration = true;
        this.userRegistrationModel.firstName =
          this.registerUserForm.controls[this.formConstants.firstName].value.trim();
        this.userRegistrationModel.lastName =
          this.registerUserForm.controls[this.formConstants.lastName].value.trim();
        this.userRegistrationModel.email =
          this.registerUserForm.controls[this.formConstants.email].value?.trim();
        this.userRegistrationModel.mobileNumber =
          this.registerUserForm.controls[this.formConstants.contactNumber].value?.trim();
        this.userRegistrationModel.driveId =
          this.registerUserForm.controls[this.formConstants.driveId].value.toString();
        this.userRegistrationModel.areaOfInterestId =
          this.registerUserForm.controls[this.formConstants.fieldOfInterest].value.toString();
        this.userRegistrationModel.examDate =
          this.registerUserForm.controls[this.formConstants.date].value;
        this.userRegistrationModel.examStartTime = this.disableDateTimeField
          ? this.registerUserForm.controls[this.formConstants.time].value
          : format(
              parse(
                this.registerUserForm.controls[this.formConstants.time].value,
                TimeFormates.HH_MM,
                new Date(),
              ),
              TimeFormates.HH_MM_SS,
            );
        this.userRegistrationModel.password =
          this.registerUserForm.controls[this.formConstants.password].value;
        this.userRegistrationModel.source =
          this.registerUserForm.controls[this.formConstants.source].value;
        this.userRegistrationModel.location =
          this.registerUserForm.controls[this.formConstants.location]?.value?.trim() ?? '';
        this.userRegistrationModel.qualificationId =
          this.registerUserForm.controls[this.formConstants.qualification]?.value?.id?.toString() ??
          '0';
        this.userRegistrationModel.whatsappNumber =
          this.registerUserForm.controls[this.formConstants.whatsappNumber]?.value ?? '';
        this.userRegistrationModel.otherQualification =
          this.registerUserForm.controls[this.formConstants.otherQualification]?.value ?? '';

        const formdata: FormData = new FormData();
        formdata.append(this.formConstants.user, JSON.stringify(this.userRegistrationModel));
        formdata.append(this.formConstants.photo, this.photoFile as Blob);
        formdata.append(this.formConstants.resume, this.resumeFile as Blob);

        this.showLoader = true;
        this.authService.registerUser(formdata).subscribe(
          (response) => {
            this.showLoader = false;

            if (response.result) {
              this.localStorageService.removeItem(this.formConstants.examineeDriveId);
              this.toastr.success(response?.message);
              this.photoFile = undefined;
              this.resumeFile = undefined;
              this.previouslySelectedPhotoFile = undefined;
              this.previouslySelectedResumeFile = undefined;
              if (this.driveData.registrationType == this.formConstants.IP) {
                this.session.login();
                this.loginUser(response.data);
              } else {
                this.localStorageService.setItem(
                  this.formConstants.examineeDriveId,
                  this.driveData.id.toString(),
                );
                this.router.navigate(['/successful-registration']);
              }
            } else {
              this.toastr.error(response?.message);
              this.finishRegistration = false;
              return;
            }
          },
          (error: HttpErrorResponse) => {
            this.showLoader = false;
            this.finishRegistration = false;
            if (error.status !== 500) {
              this.toastr.error(error.error?.message);
              return;
            }
            //Check Internet Connection Before Login
            let on = true;
            let online = function () {
              on = true;
              LoggerService.log('online');
            };
            let offline = function () {
              on = false;
              LoggerService.log('offline');
            };
            window.addEventListener('online', online);
            window.addEventListener('offline', offline);
            if (on) {
              const messageDialogData = new messageDialog(
                MessageDialogTitles.NetworkIssue,
                DialogMessages.InternetIssueBeforeRegistration,
                IconNames.ErrorOutline,
                true,
                false,
                MessageDialogButtonNames.OK,
              );
              const config: MatDialogConfig = {
                width: '500px',
                height: '375px',
                disableClose: true,
                data: messageDialogData,
              };
              this.dialog.closeAll();
              this.dialog.open(MessageDialogComponent, config).afterClosed();
            } else {
              const messageDialogData = new messageDialog(
                MessageDialogTitles.ErrorInRegistration,
                DialogMessages.PleaseContactWithHR,
                IconNames.HighlightOff,
                true,
                false,
                MessageDialogButtonNames.OK,
              );
              const config: MatDialogConfig = {
                width: '475px',
                height: '350px',
                disableClose: true,
                data: messageDialogData,
              };
              this.dialog.closeAll();
              this.dialog.open(MessageDialogComponent, config).afterClosed();
            }
          },
        );
      }
    }
  }

  loginUser(user: UserModel) {
    this.localStorageService.setItem('user', user);
    this.localStorageService.setItem('isStart', true);
    this.localStorageService.setItem('userId', user.id);
    this.localStorageService.setItem('userType', user.userType);
    this.localStorageService.setItem('categoryId', user.areaOfInterestId);
    this.localStorageService.setItem('token', user.token);
    this.localStorageService.setItem('loginStatus', '');
    this.localStorageService.setItem('examineeDriveId', user.driveId);
    this.localStorageService.setItem('name', user.firstName + ' ' + user.lastName);
    this.localStorageService.setItem('isSessionExpired', false);
    this.router.navigate(['question-type']);
  }

  showTermsAndConditions() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    this.dialog.open(TermsAndConditionsDialogComponent, dialogConfig);
  }

  onSelectQualification(event: MatSelectChange) {
    if (
      event.value.name == 'Others' ||
      event.value.name == 'Other' ||
      event.value.name == 'others' ||
      event.value.name == 'other'
    ) {
      this.showOtherQualificationField = true;
      this.registerUserForm.controls['otherQualification'].reset();
      this.registerUserForm.controls['otherQualification'].setValidators([
        Validators.required,
        Validators.pattern(/[\s]*[\w\.]+[\s]*/),
      ]);
      this.registerUserForm.updateValueAndValidity();
    } else {
      this.showOtherQualificationField = false;
      this.registerUserForm.controls['otherQualification'].clearValidators();
      this.registerUserForm.controls['otherQualification'].updateValueAndValidity();
    }
  }

  checkExamDate(driveData: DriveModel): boolean {
    if (
      driveData.driveDate != null &&
      driveData.driveDate != '' &&
      driveData.driveDate != undefined
    ) {
      let currentDateArray = this.currentDate[0].split(' ');
      let currentDate = currentDateArray[0];
      let currentTime = currentDateArray[1].trim();

      if (driveData.driveDate < currentDate) {
        return false;
      } else if (driveData.driveDate == currentDate) {
        let driveEndTime = driveData.endTime ? driveData.endTime : '';
        if (driveEndTime < currentTime) {
          return false;
        }
      }
    }

    return true;
  }

  checkInternetConnectivity() {
    const connected = window.navigator.onLine;
    if (!connected) {
      const messageDialogData = new messageDialog(
        MessageDialogTitles.NetworkIssue,
        DialogMessages.InternetIssueBeforeRegistration,
        IconNames.ErrorOutline,
        true,
        false,
        MessageDialogButtonNames.OK,
      );
      const config: MatDialogConfig = {
        width: '500px',
        height: '375px',
        disableClose: true,
        data: messageDialogData,
      };
      this.dialog.closeAll();
      this.dialog
        .open(MessageDialogComponent, config)
        .afterClosed()
        .subscribe((result) => {
          this.isSubmitted = false;
          this.showLoader = false;
          this.disablePasswordButton = false;
        });
      return connected;
    }
    return connected;
  }
}
