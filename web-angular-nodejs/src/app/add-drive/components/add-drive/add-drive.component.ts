import { DatePipe } from '@angular/common';
import { Component, HostListener, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { StageModel } from '../../../interviewer/models/stage.model';
import { InterviewerService } from '../../../interviewer/services/interviewer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControlVariables } from '../../../core/constants.ts/form-control-variables';
import { InterviewStages } from '../../../interviewer/enums/InterviewStages';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../auth/services/session.service';
import { AgoraStatus } from '../../../core/constants/agoraRtc';
import { LoaderConfig } from '../../../core/constants/loader';
import { LoggerMessages, ResponseMessages, TosterMessages } from '../../../core/constants/messages';
import { Regex } from '../../../core/constants/regex';
import { AddEmailTemplateDialogComponent } from '../../../core/dialog/add-email-template-dialog/add-email-template-dialog.component';
import { AddGroupNameDialogComponent } from '../../../core/dialog/add-group-name-dialog/add-group-name-dialog.component';
import { EmailTemplatePreviewDialogComponent } from '../../../core/dialog/email-template-preview-dialog/email-template-preview-dialog.component';
import { Status } from '../../../core/enums/Comman';
import { TimeFormates } from '../../../core/enums/DateTimeFormate';
import { TemplateActions, UserLoginAndRegisrationType } from '../../../core/enums/Drive';
import { PermissionLevel } from '../../../core/enums/PermissionLevel';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { LoaderConfigInteface } from '../../../core/interface/loaderConfig';
import { AreaModel } from '../../../core/models/area.model';
import { DriveModel } from '../../../core/models/drive.model';
import { DriveTemplateAssociation } from '../../../core/models/driveTemplateAssociation';
import { EmailTemplateModel } from '../../../core/models/emailTemplate.model';
import { MessageTemplate } from '../../../core/models/message-template.model';
import { PaperModel } from '../../../core/models/paper.model';
import { TemplateGroup } from '../../../core/models/templateGroup.model';
import { AddFormfieldRequest } from '../../../core/request/addFormFieldRequest';
import { AddQualificationToDriveRequest } from '../../../core/request/addQualificationsToDriveRequest';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { LoggerService } from '../../../core/services/logger.service';
import { MenuService } from '../../../core/services/menu.service';
import { UtilsService } from '../../../core/services/utils.service';
import {
  DATE_FORMAT,
  DialogMessages,
  HeaderNames,
  IconNames,
  InputLable,
  MessageDialogButtonNames,
  PageRoutes,
  PageTarget,
  TemplateConstants,
  TimeValidationConstants,
} from '../../../core/utils/constants';
import { CutoffModel } from '../../../drive-setup/models/cutOffModel';
import { DrivePreviewDialogComponent } from '../../dialog/drive-preview-dialog/drive-preview-dialog.component';
import { Qualification } from '../../models/qualification.model';
import { TimeSlot } from '../../models/timeSlot.model';
import { AddDriveService } from '../../services/addDrive.service';
import { messageDialog } from '../../../core/models/messageDialog';
import { MessageDialogComponent } from '../../../core/dialog/message-dialog/message-dialog.component';
import { format } from 'date-fns';
import { AddMessageTemplateToDrive } from '../../models/add-message-template-to-drive.model';
import { AddDriveRequest } from '../../requests/add-drive.request';
import { AddObjectiveCutoffRequest } from '../../requests/objective-cutoff.request';
import { checkQuestionCountForAOIRequest } from '../../requests/check-question-count.request';
import { AddEmailTemplateRequest } from '../../../core/request/add-email-template.request';

@Component({
  selector: 'app-add-drive',
  templateUrl: './add-drive.component.html',
  styleUrls: ['./add-drive.component.scss'],
})
export class AddDriveComponent {
  registrationType: string = UserLoginAndRegisrationType.Global;
  loginType: string = UserLoginAndRegisrationType.Global;
  visibleRegIP: boolean = false;
  visibleLoginIP: boolean = false;
  registrationIP: string = '';
  loginIP: string = '';
  showCriteriaField: boolean = false;
  showTimeField: boolean = false;
  agoraStatus: string = AgoraStatus.Restricted;
  showDatePicker: boolean = false;
  minDate: Date | undefined;
  driveId: number = 0;
  addDriveSectionCompleted: boolean = false;
  invalidLoginType: boolean = false;
  disableAgoraStatus: boolean = false;
  emailGroupName: string = '';
  messageGroupName: string = '';
  emailTemplateList: EmailTemplateModel[] = [];
  emailGroupList: TemplateGroup[] = [];
  messageGroupList: TemplateGroup[] = [];
  emailGroupId: number = 0;
  messageGroupId: number = 0;
  emailTemplateCount: number = 0;
  showSaveNextEmail: boolean = true;
  showSaveNextMessage: boolean = true;
  emailGroupSelected: boolean = false;
  messageGroupSelected: boolean = false;
  selectedEmailGroupId: number = 0;
  selectedGroupName: string = '';
  selectedMessageGroupId: number = 0;
  selectedMessageGroupName: string = '';
  areaOfInterestList: AreaModel[] = [];
  areaOfInterestListForPaperCutOff: AreaModel[] = [];
  paperList: PaperModel[] = [];
  currentDateSelected: boolean = false;
  header: string = HeaderNames.AddDriveComponent;
  gndAssociationListForEmail: DriveTemplateAssociation[] = [];
  gndAssociationListForMessage: DriveTemplateAssociation[] = [];
  messageTemplateList: MessageTemplate[] = [];
  messageTemplateCount: number = 0;
  areaListAddToDrive: AreaModel[] = [];
  cutOffListAddToDrive: CutoffModel[] = [];
  subjectCount: number = 0;
  enableSkipandNextButton: boolean = false;
  disableAddEmailTemplateButton: boolean = false;
  disableAddScreenMessageButton: boolean = false;
  formFieldsString: string = '';
  timeSlots: TimeSlot[] | undefined;
  showTimeSlot: boolean = true;
  qualificationList: Qualification[] = [];
  selectedQualification: number[] = [];
  isAdminDefineExamDate: boolean = true;
  isAdminDefineExamTime: boolean = true;
  loaderConfig: LoaderConfigInteface = LoaderConfig;
  loader: boolean = false;
  isAutoCutOffFocusOut: boolean = true;
  submitted: boolean = false;
  disableButton: boolean = false;
  showInterviewStages: boolean = false;
  interviewStages: StageModel[] = [];
  areaOfInterestStagesMap: { [key: number]: number[] } = {};
  currentAreaOfInterestId: number = 0;
  finalOfferStage: string = InterviewStages.FINAL_OFFER;
  access: string = '';
  TemplateActions: typeof TemplateActions = TemplateActions;
  @ViewChildren('stageCheckboxRef') stageCheckboxRef!: QueryList<MatCheckbox>;

  addDriveFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.driveName]: [
      '',
      [Validators.required, Validators.pattern(Regex.Blank)],
    ],
    [this.formControlVariables.registrationIP]: [''],
    [this.formControlVariables.loginIP]: [''],
    [this.formControlVariables.criteria]: ['', Validators.pattern(Regex.PositiveNumber)],
    [this.formControlVariables.driveStartTime]: [''],
    [this.formControlVariables.driveEndTime]: [''],
    [this.formControlVariables.driveDate]: [''],
    [this.formControlVariables.agoraStatus]: ['', Validators.required],
    [this.formControlVariables.timeSlot]: ['', [Validators.required]],
    [this.formControlVariables.waitingTimeForPaperListPage]: [
      '',
      [Validators.required, Validators.pattern(Regex.PositiveNumber), Validators.max(5)],
    ],
    [this.formControlVariables.waitingTimeForInstructionsPage]: [
      '',
      [Validators.required, Validators.pattern(Regex.PositiveNumber), Validators.max(5)],
    ],
  });

  addFormFieldsFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.firstName]: [true, Validators.requiredTrue],
    [this.formControlVariables.lastName]: [true, Validators.requiredTrue],
    [this.formControlVariables.email]: [true, Validators.requiredTrue],
    [this.formControlVariables.contact]: [true, Validators.requiredTrue],
    [this.formControlVariables.areaOfInterest]: [true, Validators.requiredTrue],
    [this.formControlVariables.date]: [true, Validators.requiredTrue],
    [this.formControlVariables.time]: [true, Validators.requiredTrue],
    [this.formControlVariables.profile]: [false],
    [this.formControlVariables.resume]: [false],
    [this.formControlVariables.qualification]: [false],
    [this.formControlVariables.whatsappNumber]: [false],
    [this.formControlVariables.location]: [false],
    [this.formControlVariables.source]: [false],
  });

  addAreaFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.areaOfInterest]: ['', Validators.required],
  });

  addPaperCutOffFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.areaOfInterest]: ['', Validators.required],
    [this.formControlVariables.paper]: ['', Validators.required],
    [this.formControlVariables.cutOffMarks]: [
      '',
      [
        Validators.required,
        Validators.pattern(Regex.NumberWithoutDecimal),
      ],
    ],
    [this.formControlVariables.autoCutOffMarks]: [
      '',
      [
        Validators.pattern(Regex.NumberWithoutDecimal),
      ],
    ],
  });

  selectEmailTemplateFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.selectedEmailTemplate]: [''],
  });

  selectMessageTemplateFormGroup: FormGroup = this._formBuilder.group({
    [this.formControlVariables.selectedMessageTemplate]: [''],
  });

  isEditable = false;

  constructor(
    private utilsService: UtilsService,
    private menuService: MenuService,
    private storageService: LocalStorageService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private api: AddDriveService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private session: SessionService,
    public formControlVariables: FormControlVariables,
    private interviewerService: InterviewerService,
  ) {
    this.access = this.menuService.getAccess(this.menuService.currentUrl);
    if (!this.utilsService.comparePermissions(this.access, PermissionLevel.ADD)) {
      this.utilsService.navigateToUnauthorizedPage();
    }
    LoggerService.log(LoggerMessages.AddDrive, this.access);
  }

  async ngOnInit(): Promise<void> {
    this.addDriveFormGroup.controls[this.formControlVariables.agoraStatus].reset('Restricted');
    this.minDate = new Date();
    this.getEmailTemplateTypes(true);
    this.getMessageTemplateTypes(true);
    this.getPaperData(false);
    this.loadTimeSlots();
    this.getQualifications();
    this.getInterviewStages();
  }

  selectQualification(event: MatSelectChange) {
    this.selectedQualification = event.value?.map(
      (qualification: Qualification) => qualification?.id,
    );
  }

  async getQualifications() {
    this.api.getAllQualification().subscribe(
      (data: APIResponseObject) => {
        if (data.result) {
          this.qualificationList = data.data.qualificationList;
        } else {
          LoggerService.log(LoggerMessages.Error, data.message);
          this.toastr.error(TosterMessages.InternalServerError);
        }
      },
      (error: any) => {
        LoggerService.log(LoggerMessages.Error, error);
      },
    );
  }

  selectLoginType(event: MatRadioChange) {
      const isIPLogin = event.value === 2;
  
      this.loginType = isIPLogin ? UserLoginAndRegisrationType.IP : UserLoginAndRegisrationType.Global;
      this.invalidLoginType = !isIPLogin && this.registrationType === UserLoginAndRegisrationType.IP;
      this.disableAgoraStatus = isIPLogin;
      this.visibleLoginIP = isIPLogin;
      this.showTimeSlot = !this.invalidLoginType;
  
      const agoraStatusControl = this.addDriveFormGroup.controls[this.formControlVariables.agoraStatus];
      const loginIPControl = this.addDriveFormGroup.controls[this.formControlVariables.loginIP];
      const timeSlotControl = this.addDriveFormGroup.controls[this.formControlVariables.timeSlot];
      const registrationIPControl = this.addDriveFormGroup.controls['registrationIP'];
  
      agoraStatusControl.reset(isIPLogin ? 'Unrestricted' : 'Restricted');
  
      if (isIPLogin) {
        loginIPControl.addValidators(Validators.required);
        loginIPControl.enable();
        if (this.registrationType === UserLoginAndRegisrationType.Global) {
          timeSlotControl.addValidators(Validators.required);
        } else {
          loginIPControl.setValue(registrationIPControl.value);
          timeSlotControl.removeValidators(Validators.required);
          timeSlotControl.reset('');
          loginIPControl.disable();
        }
      } else {
        loginIPControl.removeValidators(Validators.required);
        loginIPControl.reset('');
        loginIPControl.enable();
        if (this.registrationType !== UserLoginAndRegisrationType.IP) {
          timeSlotControl.addValidators(Validators.required);
        } else {
          timeSlotControl.removeValidators(Validators.required);
          timeSlotControl.reset('');
        }
      }
  
      loginIPControl.updateValueAndValidity();
      timeSlotControl.updateValueAndValidity();
  }

  selectRegistrationType(event: MatRadioChange) {
    const isIPRegistration = event.value === 2;

    this.registrationType = isIPRegistration ? UserLoginAndRegisrationType.IP : UserLoginAndRegisrationType.Global;
    this.visibleRegIP = isIPRegistration;
    this.invalidLoginType = !isIPRegistration && this.loginType === UserLoginAndRegisrationType.Global;
    this.showTimeSlot = !isIPRegistration || this.loginType !== UserLoginAndRegisrationType.IP;

    const registrationIPControl = this.addDriveFormGroup.controls[this.formControlVariables.registrationIP];
    const timeSlotControl = this.addDriveFormGroup.controls[this.formControlVariables.timeSlot];
    const loginIPControl = this.addDriveFormGroup.controls[this.formControlVariables.loginIP];

    if (isIPRegistration) {
      registrationIPControl.addValidators(Validators.required);
      if (this.loginType === UserLoginAndRegisrationType.Global) {
        timeSlotControl.removeValidators(Validators.required);
        timeSlotControl.reset('');
        loginIPControl.enable();
      } else {
        registrationIPControl.setValue(loginIPControl.value);
        timeSlotControl.removeValidators(Validators.required);
        timeSlotControl.reset('');
        loginIPControl.disable();
      }
    } else {
      registrationIPControl.removeValidators(Validators.required);
      registrationIPControl.reset('');
      timeSlotControl.addValidators(Validators.required);
      loginIPControl.enable();
    }

    registrationIPControl.updateValueAndValidity();
    timeSlotControl.updateValueAndValidity();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addDriveFormGroup.controls[controlName].hasError(errorName);
  };

  validateIP(type: string) {
    const control = this.addDriveFormGroup.controls[type];
    const ipValue = control.value;

    if (ipValue) {
      const ipArray = ipValue.split(',').map((ip: string) => ip.trim());
      const allValid = ipArray.every((ip) => Regex.IpValidation.test(ip));

      if (allValid) {
        if (
          this.loginType === UserLoginAndRegisrationType.IP &&
          this.registrationType === UserLoginAndRegisrationType.IP
        ) {
          const otherControlType = type === 'registrationIP' ? 'loginIP' : 'registrationIP';
          this.addDriveFormGroup.controls[otherControlType].setValue(ipValue);
        }
        control.setErrors(null);
      } else {
        control.setErrors({ pattern: true });
      }
    }
  }

  setEligibilityCriteria(event: MatCheckboxChange) {
    this.showCriteriaField = event.checked;
    if (this.showCriteriaField) {
      this.addDriveFormGroup.controls[this.formControlVariables.criteria].addValidators([
        Validators.required,
      ]);
    } else {
      this.addDriveFormGroup.controls[this.formControlVariables.criteria].removeValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.criteria].reset('');
    }
  }

  selectDateType(event: MatRadioChange) {
    if (event.value == 'custom') {
      this.showDatePicker = true;
      this.addDriveFormGroup.controls[this.formControlVariables.driveDate].addValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].addValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.driveEndTime].addValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.timeSlot].removeValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.timeSlot].reset('');
      this.showTimeSlot = false;
    } else {
      this.showDatePicker = false;
      this.addDriveFormGroup.controls[this.formControlVariables.driveDate].removeValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.driveDate].reset('');
      this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].removeValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.driveEndTime].removeValidators([
        Validators.required,
      ]);
      this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].reset('');
      this.addDriveFormGroup.controls[this.formControlVariables.driveEndTime].reset('');
      this.addDriveFormGroup.controls[this.formControlVariables.timeSlot].addValidators([
        Validators.required,
      ]);
      this.showTimeSlot = !(this.registrationType == UserLoginAndRegisrationType.IP);
    }
  }

  onSelectDriveDate(event: MatDatepickerInputEvent<Date>) {
    const dateFormat = this.datePipe.transform(event.value, DATE_FORMAT);
    this.addDriveFormGroup.controls[this.formControlVariables.driveDate].setValue(dateFormat);
    let currentDate = new Date().toISOString().split('T')[0];
    let currentTime = new Date().toISOString().split('T')[1];
    if (dateFormat == currentDate) {
      this.currentDateSelected = true;
      if (
        currentTime <
        this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].value
      ) {
        this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].setErrors({
          current: true,
        });
      }
    } else {
      this.currentDateSelected = false;
      if (this.hasError(this.formControlVariables.driveStartTime, 'current')) {
        this.addDriveFormGroup.controls[this.formControlVariables.driveStartTime].setErrors(null);
      }
    }
    this.onSelectDriveTime(TimeValidationConstants.Start);
    this.onSelectDriveTime(TimeValidationConstants.End);
  }

  private validateTime(
    controlName: string,
    otherControlName: string,
    isCurrentDate: boolean,
    compareType: string,
  ): void {
    const currentTime: string = format(new Date(), TimeFormates.HH_MM);
    const control = this.addDriveFormGroup.controls[controlName];
    const otherControl = this.addDriveFormGroup.controls[otherControlName];
    const time = control?.value && format(control.value, TimeFormates.HH_MM);
    const otherTime = otherControl?.value && format(otherControl.value, TimeFormates.HH_MM);

    if (!time && !otherTime) {
      return;
    }

    let error: Record<string, boolean> | null = null;

    if (time) {
      if (isCurrentDate && time < currentTime) {
        error = { current: true };
      } else if (otherTime) {
        switch (compareType) {
          case TimeValidationConstants.Start:
            if (time >= otherTime) {
              error = { incorrect: true };
            }
            break;
          case TimeValidationConstants.End:
            if (time <= otherTime) {
              error = { incorrect: true };
            }
            break;
        }
      }
    }

    control?.setErrors(error);
  }

  onSelectDriveTime(typeOfTime: string): void {
    const { driveStartTime, driveEndTime } = this.formControlVariables;
    if (typeOfTime === TimeValidationConstants.Start) {
      this.validateTime(
        driveStartTime,
        driveEndTime,
        this.currentDateSelected,
        TimeValidationConstants.Start,
      );
    }
    if (typeOfTime === TimeValidationConstants.End) {
      this.validateTime(
        driveEndTime,
        driveStartTime,
        this.currentDateSelected,
        TimeValidationConstants.End,
      );
    }
  }

  onDriveTimeFocusOut() {
    this.onSelectDriveTime(TimeValidationConstants.Start);
    this.onSelectDriveTime(TimeValidationConstants.End);
  }

  onDriveTimeMouseMove() {
    this.onSelectDriveTime(TimeValidationConstants.Start);
    this.onSelectDriveTime(TimeValidationConstants.End);
  }
addDrive(stepper: any) {
    if (this.addDriveFormGroup.valid && !this.invalidLoginType) {
      this.disableButton = true;
      const {
        driveName,
        registrationIP,
        driveDate,
        agoraStatus,
        driveStartTime,
        driveEndTime,
        criteria,
        timeSlot,
        waitingTimeForPaperListPage,
        waitingTimeForInstructionsPage,
      } = this.formControlVariables;

      const driveObject: DriveModel = {
        id: this.driveId !== 0 ? this.driveId : 0,
        name: this.addDriveFormGroup.controls[driveName].value,
        status: Status.Inactive,
        userRegistrationStatus: Status.Inactive,
        registrationType: this.registrationType,
        loginType: this.loginType,
        registrationIP: this.registrationType === UserLoginAndRegisrationType.Global
          ? null
          : this.addDriveFormGroup.controls[registrationIP].value,
        loginIP: this.loginType === UserLoginAndRegisrationType.Global
          ? null
          : this.addDriveFormGroup.controls['loginIP'].value,
        driveDate: this.showDatePicker
          ? this.addDriveFormGroup.controls[driveDate].value
          : null,
        agoraStatus: this.addDriveFormGroup.controls[agoraStatus].value,
        startTime: moment(this.addDriveFormGroup.controls[driveStartTime].value).format('HH:mm:ss'),
        endTime: moment(this.addDriveFormGroup.controls[driveEndTime].value).format('HH:mm:ss'),
        registrationCriteria: this.showCriteriaField
          ? this.addDriveFormGroup.controls[criteria].value
          : null,
        formFields: this.formFieldsString,
        timeSlots: [...this.addDriveFormGroup.controls[timeSlot].value],
        waitingTimeForPaperListPage: this.addDriveFormGroup.controls[waitingTimeForPaperListPage].value,
        waitingTimeForInstructionsPage: this.addDriveFormGroup.controls[waitingTimeForInstructionsPage].value,
        walkIn: false,
        completed: false,
        countAssociation: 0,
        areaOfInterestList: [],
        checked: false,
        qualifications: []
      };

      this.api.addDrive(new AddDriveRequest(driveObject)).subscribe({
        next: (data: APIResponseObject) => {
          this.disableButton = false;
          const { message, data: responseData } = data || {};
          const driveId = responseData?.['id'];

          if (message === ResponseMessages.DriveAddedSuccessfully) {
            this.toastr.success(TosterMessages.DriveAdded);
            this.driveId = driveId;
            this.addValidationsForFormFields(responseData);
            this.isEditable = false;
            stepper.next();
          } else if (message === ResponseMessages.DriveEditedSuccessfully) {
            this.toastr.success(TosterMessages.DriveUpdated);
            this.driveId = driveId;
            this.addValidationsForFormFields(responseData);
            this.isEditable = false;
            stepper.next();
          } else {
            this.toastr.error(TosterMessages.DuplicateDriveName);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error?.error?.message);
          this.disableButton = false;
        },
      });
    } else {
      this.addDriveFormGroup.markAsTouched();
      this.toastr.error(TosterMessages.PleaseFillAllDetails);
    }
  }

  addValidationsForFormFields(response: any) {
    this.driveId = response['id'];
    if (response['driveDate'] !== null) {
      this.addFormFieldsFormGroup.controls[this.formControlVariables.date].removeValidators(
        Validators.requiredTrue,
      );
      this.addFormFieldsFormGroup.controls[this.formControlVariables.time].removeValidators(
        Validators.requiredTrue,
      );

      this.isAdminDefineExamDate = false;
      this.isAdminDefineExamTime = false;
    } else {
      this.isAdminDefineExamDate = true;
      this.isAdminDefineExamTime = true;
    }
  }

  addFormFields(stepper: MatStepper) {
    if (this.addFormFieldsFormGroup.valid) {
      this.disableButton = true;

      let fieldObject: string = JSON.stringify(this.addFormFieldsFormGroup.value);

      let addFormFieldRequest: AddFormfieldRequest = {
        id: this.driveId,
        formFields: fieldObject,
      };

      if (this.addFormFieldsFormGroup.controls[this.formControlVariables.qualification].value) {
        if (this.selectedQualification.length > 0) {
          this.saveQualificationForDriveAPICall().then(() => {
            this.addFormFieldsAPICall(addFormFieldRequest).then(() => {
              this.isEditable = false;
              this.formFieldsString = fieldObject;
              this.disableButton = false;
              stepper.next();
            });
          });
        } else {
          this.toastr.error(TosterMessages.PleaseSelectQualification);
          this.disableButton = false;
        }
      } else {
        this.addFormFieldsAPICall(addFormFieldRequest).then((data: any) => {
          this.isEditable = false;
          this.formFieldsString = fieldObject;
          this.disableButton = false;
          this.toastr.success(data);
          stepper.next();
        });
      }
    } else {
      this.disableButton = false;
      this.toastr.error(TosterMessages.CheckAllRequiredCheckbox);
    }
  }

  async saveQualificationForDriveAPICall() {
    return new Promise<void>((resolve, reject) => {
      let dddQualificationToDriveRequest: AddQualificationToDriveRequest = {
        driveId: this.driveId,
        qualifications: this.selectedQualification,
      };
      this.api
        .saveQualificationForDrive(dddQualificationToDriveRequest)
        .subscribe((response: APIResponseObject) => {
          if (response.result) {
            this.toastr.success(response.message);
            resolve();
          } else {
            this.toastr.error(response.message);
            reject();
          }
        });
    });
  }

  async addFormFieldsAPICall(addFormFieldRequest: AddFormfieldRequest) {
    return new Promise<void>((resolve, reject) => {
      this.api.addFormFields(addFormFieldRequest).subscribe((response: APIResponseObject) => {
        if (response.result) {
          resolve(response.message);
        } else {
          this.toastr.error(response.message);
          reject(response.message);
        }
      });
    });
  }

  async getEmailTemplateTypes(getType: boolean, stepper?: any) {
    this.api.getEmailTemplateTypes().subscribe((data) => {
      this.getMessageTemplateTypes(true);
      if (getType) {
        this.emailTemplateList = data.data['templateTypeList'];
        this.emailTemplateList.forEach((type: EmailTemplateModel) => {
          type.templateAdded = false;
          type.isEdit = false;
          type.content = '';
          type.subject = '';
        });
      }
      this.emailGroupList = data.data['groupList'];
      if (!getType) {
        this.selectEmailTemplateFormGroup.controls[
          this.formControlVariables.selectedEmailTemplate
        ].reset(this.selectedEmailGroupId);
        stepper.next();
      }
    });
  }
  saveTemplates(stepper: MatStepper, text: string) {
    const isSave = text === TemplateConstants.Save;
    const contentList = this.getEmailTemplateDTOList();
    const driveId = this.driveId;

    if (isSave) {
      const requestObject: AddEmailTemplateRequest = {
        groupId: this.selectedEmailGroupId,
        groupName: this.selectedGroupName,
        driveId,
        contentList,
        edit: false,
      };
      this.saveTemplateObject(stepper, requestObject);
      return;
    }

    if (this.gndAssociationListForEmail.some(record => record.groupId === this.selectedEmailGroupId)) {
      const requestObject: AddEmailTemplateRequest = {
        groupId: this.selectedEmailGroupId,
        groupName: this.emailGroupName,
        driveId,
        contentList,
        edit: true,
      };
      this.saveTemplateObject(stepper, requestObject);
      return;
    }

    this.emailGroupId = 0;
    if (this.emailTemplateCount !== 8) {
      this.toastr.error(TosterMessages.PleaseAddAllTemplates);
    } else if (this.subjectCount !== 8) {
      this.toastr.error(TosterMessages.PleaseAddAllSubject);
    } else {
      this.openAddGroupNameDialog().afterClosed().subscribe((groupName) => {
        if (groupName) {
          const requestObject: AddEmailTemplateRequest = {
            groupId: this.emailGroupId,
            groupName: groupName.trim(),
            driveId,
            contentList,
            edit: false,
          };
          this.saveTemplateObject(stepper, requestObject);
        } else {
          this.toastr.error(TosterMessages.PleaseEnterGroupName);
        }
      });
    }
  }

  private openAddGroupNameDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      headerMessage: HeaderNames.AddEmailGroupDialogHeader,
      titleMessage: InputLable.EmailTemplateName,
    };
    return this.dialog.open(AddGroupNameDialogComponent, dialogConfig);
  }

  saveTemplateObject(stepper: any, obj: any) {
    this.disableAddEmailTemplateButton = true;
    this.api.saveEmailTemplates(obj).subscribe({
      next: (response: APIResponseObject) => {
        let responseObject = response.data;
        if (response.message == ResponseMessages.SavedSuccessfully) {
          this.gndAssociationListForEmail = [];
          this.gndAssociationListForEmail = responseObject.associationList;
          this.isEditable = false;
          this.toastr.success(response.message);
          this.selectedEmailGroupId = responseObject.groupId;
          this.getEmailTemplateTypes(false, stepper);
          this.disableAddEmailTemplateButton = false;
        } else if (response.message == ResponseMessages.CouldNotSaveEmailTemplates) {
          this.disableAddEmailTemplateButton = false;
          this.toastr.error(response.message);
        } else if (response.message == ResponseMessages.UpdatedSuccessfully) {
          this.gndAssociationListForEmail = [];
          this.gndAssociationListForEmail = responseObject.associationList;
          this.isEditable = false;
          this.toastr.success(response.message);
          stepper.next();
          this.disableAddEmailTemplateButton = false;
          this.selectedEmailGroupId = responseObject.groupId;
        } else if (response.message == ResponseMessages.GroupNameAlreadyExist) {
          this.disableAddEmailTemplateButton = false;
          stepper.next();
        } else {
          this.toastr.error(TosterMessages.CouldNotSaveEmailTemplates);
          this.disableAddEmailTemplateButton = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error?.error?.message);
        this.disableAddEmailTemplateButton = false;
      },
    });
  }

  onSelectEmailGroup(groupId: any) {
    this.api.getEmailTemplatesByGroupId(groupId).subscribe((data: EmailTemplateModel[]) => {
      this.emailGroupSelected = true;
      this.showSaveNextEmail = false;
      this.emailTemplateCount = 8;
      this.subjectCount = 8;
      this.emailTemplateList = data;
      this.emailTemplateList.forEach((type) => {
        type.templateAdded = true;
        type.isEdit = true;
      });
    });
    this.selectedEmailGroupId = groupId;
    this.emailGroupList.forEach((group) => {
      if (group.id == this.selectedEmailGroupId) {
        this.selectedGroupName = group.name;
      }
    });
  }
  addTemplateModal(id: any, option: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1000px';

    const foundIndex = this.emailTemplateList.findIndex((data) => data.id === id);
    if (foundIndex === -1) {
      return;
    }
    const emailTemplate = this.emailTemplateList[foundIndex];

    dialogConfig.data = {
      obj: { ...emailTemplate },
      option,
      name: emailTemplate.name,
    };

    this.dialog
      .open(AddEmailTemplateDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.id) {
          const updatedIndex = this.emailTemplateList.findIndex((data) => data.id === result.id);
          if (updatedIndex !== -1) {
            const existingTemplate = this.emailTemplateList[updatedIndex];
            if (result.content == null) {
              this.toastr.error(TosterMessages.AddContent);
            } else if (existingTemplate.content !== result.content) {
              existingTemplate.isEdit = true;
              existingTemplate.templateAdded = true;
              existingTemplate.content = result.content;
              if (option === this.TemplateActions.Edit && this.emailGroupSelected) {
                this.showSaveNextEmail = true;
              }
              if (option === this.TemplateActions.Add) {
                this.emailTemplateCount += 1;
              }
            }
          }
        }
      });
  }
  async openDefaultEmailTemplateView(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1000px';
    dialogConfig.maxHeight = '500px';

    const foundIndex = this.emailTemplateList.findIndex((data) => data.id === id);
    if (foundIndex === -1) {
      return;
    }
    const emailTemplate = this.emailTemplateList[foundIndex];

    try {
      const response: APIResponseObject = await this.api.getDefaultEmailTemplate().toPromise();
      if (response?.result && response?.data) {
        dialogConfig.data = {
          obj: {
            html: response.data.replace('#editHere', emailTemplate?.content || ''),
          },
          option: 'preview',
          subject: emailTemplate?.subject,
          name: emailTemplate?.name,
        };
        this.dialog.open(EmailTemplatePreviewDialogComponent, dialogConfig);
      }
    } catch (error: any) {
      LoggerService.log(error);
    }
  }

  async getPaperData(showToaster: boolean) {
    this.loader = !this.loader;
    this.api.getAreaListForPaperCutOff(true).subscribe(
      (res: APIResponseObject) => {
        this.loader = !this.loader;
        if (res.result) {
          showToaster ? this.toastr.success(TosterMessages.AOIListRefreshed) : '';
          const selectedAreaIds = this.areaListAddToDrive.map((area: AreaModel) => area.id);
          this.areaOfInterestList = res.data?.filter(
            (area: AreaModel) => !selectedAreaIds?.includes(area.id),
          );
        } else {
          this.toastr.error(res.message);
        }
      },
      (error: any) => {
        LoggerService.log(error);
        this.loader = !this.loader;
      },
    );
  }

  stepToPaperCutOff(stepper: MatStepper) {
    if (this.areaListAddToDrive.length == 0) {
      this.toastr.error(TosterMessages.AddAtleastOneAOI);
      return;
    }
    this.api
      .checkQuestionCountForAOI(
        new checkQuestionCountForAOIRequest(this.areaListAddToDrive.map((aoI) => aoI.id)),
      )
      .subscribe({
        next: (response: APIResponseObject) => {
          if (response.result) {
            this.updatePaperCutOffList(stepper);
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error?.error?.message);
        },
      });
  }

  updatePaperCutOffList(stepper: MatStepper) {
    this.areaOfInterestListForPaperCutOff = [];
    this.areaOfInterestListForPaperCutOff = this.areaListAddToDrive;
    if (
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.areaOfInterest].value != ''
    ) {
      let idx = this.areaListAddToDrive.findIndex(
        (x) =>
          x.id ==
          this.addPaperCutOffFormGroup.controls[this.formControlVariables.areaOfInterest].value,
      );
      if (idx < 0) {
        this.resetValue();
        this.paperList = [];
      }
    } else {
      this.paperList = [];
    }

    if (this.cutOffListAddToDrive.length > 0) {
      this.cutOffListAddToDrive.forEach((cutOff: CutoffModel) => {
        let idx = this.areaListAddToDrive.findIndex((x) => x.id == cutOff.areaOfInterestId);
        if (idx < 0) {
          this.cutOffListAddToDrive = this.cutOffListAddToDrive.filter(
            (item: CutoffModel) => item.areaOfInterestId !== cutOff.areaOfInterestId,
          );
        }
      });
    } else {
    }
    this.isEditable = false;
    stepper.next();
  }

  loadPapers(event: any) {
    this.api.getPaperByAreaOfInterestId(event.value).subscribe(
      (data: APIResponseObject) => {
        this.addPaperCutOffFormGroup.controls[this.formControlVariables.paper].setValue('');
        this.paperList = [];
        this.paperList = data.data;

        if (this.cutOffListAddToDrive.length > 0) {
          this.cutOffListAddToDrive.forEach((cutOff: CutoffModel) => {
            this.paperList = this.paperList.filter((paper) => paper.id !== cutOff.paperId);
          });
        }
        if (this.paperList.length == 0) {
          this.enableSkipandNextButton = true;
          this.toastr.error(TosterMessages.SelectedAOINotHaveObjectivePaper); // to add condition for objective paper not found in selected AOI........
        } else {
          this.enableSkipandNextButton = false;
        }
      },
      (error: any) => {
        LoggerService.log(error);
      },
    );
  }

  addPaperCutOff(formDirective: FormGroupDirective) {
    if (
      this.addPaperCutOffFormGroup.controls['areaOfInterest'].value == '' ||
      this.addPaperCutOffFormGroup.controls['paper'].value == '' ||
      this.addPaperCutOffFormGroup.controls['cutOffMarks'].value == ''
    ) {
      this.addPaperCutOffFormGroup.markAllAsTouched();
      this.toastr.error(TosterMessages.PleaseFillAllDetails);
    } else {
      let cutoffModel = new CutoffModel(0, 0, 0, 0, 0, 0, true);
      cutoffModel.areaOfInterestId = this.addPaperCutOffFormGroup.controls['areaOfInterest'].value;
      cutoffModel.paperId = this.addPaperCutOffFormGroup.controls['paper'].value;
      this.areaOfInterestListForPaperCutOff.forEach((area) => {
        if (area.id == cutoffModel.areaOfInterestId) {
          cutoffModel.areaOfInterestName = area.name;
        }
      });
      this.paperList.forEach((paper) => {
        if (paper.id == cutoffModel.paperId) cutoffModel.paperName = paper.name;
      });
      cutoffModel.cutoffMarks = this.addPaperCutOffFormGroup.controls['cutOffMarks'].value;
      cutoffModel.autoCutOffMarks = this.addPaperCutOffFormGroup.controls['autoCutOffMarks'].value;
      cutoffModel.driveId = this.driveId;
      cutoffModel.editMode = false;
      cutoffModel.fromAddDrive = true;

      this.cutOffListAddToDrive.push(cutoffModel);
      this.paperList = this.paperList.filter((paper) => paper.id != cutoffModel.paperId);

      this.resetValue();
      this.addPaperCutOffFormGroup.markAsUntouched();
    }
  }

  removePaperCutOff(cutOffObject: any) {
    this.cutOffListAddToDrive = this.cutOffListAddToDrive.filter(
      (cutOff: CutoffModel) =>
        cutOff.areaOfInterestId != cutOffObject.areaOfInterestId ||
        cutOff.paperId !== cutOffObject.paperId,
    );
  }

  resetValue() {
    this.addPaperCutOffFormGroup.controls[this.formControlVariables.areaOfInterest].setValue('');
    this.addPaperCutOffFormGroup.controls[this.formControlVariables.paper].setValue('');
    this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].setValue('');
    this.addPaperCutOffFormGroup.controls[this.formControlVariables.autoCutOffMarks].setValue('');
  }

  logout() {
    const messageDialogData = new messageDialog(
      DialogMessages.ConfirmationForLogout,
      DialogMessages.Empty,
      IconNames.HelpOutline,
      true,
      true,
      MessageDialogButtonNames.YesLogout,
    );
    const config: MatDialogConfig = {
      width: '500px',
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
          this.session.logout(false);
          this.router.navigate([PageRoutes.AuthPage]);
        }
      });
  }

  goToPreviousStep(stepper: any, previousStep: string, formDirective?: FormGroupDirective) {
    if (previousStep == 'addPaperCutOff') {
      this.enableSkipandNextButton = false;
    }

    this.isEditable = true;
    setTimeout(() => stepper.previous(), 500);
  }

  async getMessageTemplateTypes(getType: boolean, stepper?: any) {
    this.api.getMessageTemplateTypes().subscribe((data: any) => {
      if (getType) {
        this.messageTemplateList = data.data['templateTypeList'];
        this.messageTemplateList.forEach((type: MessageTemplate) => {
          type.templateAdded = false;
          type.isEdit = false;
          type.content = '';
        });
      }

      this.messageGroupList = data.data['groupList'];

      if (!getType) {
        this.selectMessageTemplateFormGroup.controls[
          this.formControlVariables.selectedMessageTemplate
        ].reset(this.selectedMessageGroupId);
        stepper.next();
      }
    });
  }

  addMessageTemplateModal(id: any, option: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1000px';
    const messageTemplate =
      this.messageTemplateList[
        this.messageTemplateList.findIndex((data) => {
          return data.id == id;
        })
      ];
    dialogConfig.data = {
      obj: Object.assign({}, messageTemplate),
      option: option,
      name: messageTemplate.name,
    };
    let dialogReference = this.dialog.open(AddEmailTemplateDialogComponent, dialogConfig);
    dialogReference.afterClosed().subscribe((result) => {
      this.messageTemplateList.map((data) => {
        if (data.id == result.id) {
          if (result.content == null) {
            this.toastr.error(TosterMessages.AddContent);
          } else {
            if (data.content != result.content) {
              data.isEdit = true;
              data.templateAdded = true;
              data.content = result.content;
              if (option == this.TemplateActions.Edit) {
                if (this.messageGroupSelected) {
                  this.showSaveNextMessage = true;
                }
              }
              if (option == this.TemplateActions.Add) {
                this.messageTemplateCount += 1;
              }
            }
          }
        }
      });
    });
  }

  onSelectMessageGroup(groupId: any) {
    this.api.getMessageTemplatesByGroupId(groupId).subscribe((data: APIResponseObject) => {
      this.messageGroupSelected = true;
      this.showSaveNextMessage = false;
      this.messageTemplateCount = 3;
      this.messageTemplateList = data.data;
      this.messageTemplateList.forEach((type) => {
        type.templateAdded = true;
        type.isEdit = true;
      });
    });
    this.selectedMessageGroupId = groupId;
    this.messageGroupList.forEach((group) => {
      if (group.id == this.selectedMessageGroupId) {
        this.selectedMessageGroupName = group.name;
      }
    });
  }

  saveMessageTemplates(stepper: any, text: string) {
    if (text == TemplateConstants.Save) {
      this.messageGroupId = this.selectedMessageGroupId;
      const requestBody: AddMessageTemplateToDrive = {
        groupId: this.messageGroupId,
        groupName: this.selectedMessageGroupName,
        driveId: this.driveId,
        contentList: this.getMessageTemplateDTOList(),
        edit: false,
      };
      this.saveMessageTemplateObject(stepper, requestBody);
    } else {
      if (this.gndAssociationListForMessage.length > 0) {
        let count = 0;
        this.gndAssociationListForMessage.forEach((record) => {
          if (record.groupId == this.selectedMessageGroupId) {
            count++;
          }
        });
        if (count == 1) {
          const requestBody: AddMessageTemplateToDrive = {
            groupId: this.selectedMessageGroupId,
            groupName: this.messageGroupName,
            driveId: this.driveId,
            contentList: this.getMessageTemplateDTOList(),
            edit: true,
          };
          this.saveMessageTemplateObject(stepper, requestBody);
          return;
        }
      }
      this.messageGroupId = 0;
      if (this.messageTemplateCount !== 3) {
        this.toastr.error(TosterMessages.PleaseAddAllTemplates);
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'fit-content';
        dialogConfig.width = '650px';
        dialogConfig.data = {
          headerMessage: HeaderNames.AddMeesageGroupDialogHeader,
          titleMessage: InputLable.MessageTemplateName,
        };

        const dialogRef = this.dialog.open(AddGroupNameDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.messageGroupName = data;
            const requestBody: AddMessageTemplateToDrive = {
              groupId: this.messageGroupId,
              groupName: this.messageGroupName?.trim(),
              driveId: this.driveId,
              contentList: this.getMessageTemplateDTOList(),
              edit: false,
            };
            this.saveMessageTemplateObject(stepper, requestBody);
          } else {
            this.toastr.error(TosterMessages.PleaseEnterGroupName);
          }
        });
      }
    }
  }

  saveMessageTemplateObject(stepper: any, obj: AddMessageTemplateToDrive) {
    this.disableAddScreenMessageButton = true;
    this.api.saveMessageTemplates(obj).subscribe({
      next: (data: APIResponseObject) => {
        if (data?.message == ResponseMessages.SavedSuccessfully) {
          this.gndAssociationListForMessage = [];
          this.gndAssociationListForMessage = data.data['associationList'];
          this.isEditable = false;
          this.toastr.success(data.message);
          this.selectedMessageGroupId = data.data['groupId'];
          this.selectedMessageGroupName = data.data['groupName'];
          this.getMessageTemplateTypes(false, stepper);
          this.disableAddScreenMessageButton = false;
        } else if (data?.message == ResponseMessages.CouldNotSaveEmailTemplates) {
          this.disableAddScreenMessageButton = false;
          this.toastr.error(data.message);
        } else if (data?.message == ResponseMessages.UpdatedSuccessfully) {
          this.gndAssociationListForMessage = [];
          this.gndAssociationListForMessage = data.data['associationList'];
          this.isEditable = false;
          this.toastr.success(data.message);
          stepper.next();
          this.selectedMessageGroupId = data.data['groupId'];
          this.selectedMessageGroupName = data.data['groupName'];
          this.disableAddScreenMessageButton = false;
        } else if (data?.message == ResponseMessages.GroupNameAlreadyExist) {
          this.disableAddScreenMessageButton = false;
          this.toastr.error(data.message);
        } else {
          this.toastr.error(TosterMessages.CouldNotSaveEmailTemplates);
          this.disableAddScreenMessageButton = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error?.error?.message);
        this.disableAddScreenMessageButton = false;
      },
    });
  }

  previewMessageTemplate(template: MessageTemplate) {
    this.storageService.setItem('previewData', template.content);
    window.open(`${PageRoutes.PreviewMessageTemplatePage}${template.type}`, PageTarget.Blank);
  }

  onFinalSubmit() {
    const messageDialogData = new messageDialog(
      DialogMessages.ConfirmationForSaveDrive,
      DialogMessages.Empty,
      IconNames.HelpOutline,
      true,
      true,
      MessageDialogButtonNames.Yes,
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
          this.onFinalSubmitDrive();
        }
      });
  }

  addAreaOfInterest() {
    this.submitted = true;
    let value = this.addAreaFormGroup.controls[this.formControlVariables.areaOfInterest].value;
    if (value == '') {
      this.toastr.error(TosterMessages.PleaseSelectAreaOfInterest);
    } else {
      this.areaListAddToDrive.push(value);
      this.areaOfInterestList = this.areaOfInterestList.filter((area) => area.id !== value.id);
      this.addAreaFormGroup.controls[this.formControlVariables.areaOfInterest].setValue('');
      this.showInterviewStages = false;
    }
    this.submitted = false;
  }

  removeAreaOfInterest(areaObject: any) {
    delete this.areaOfInterestStagesMap[areaObject.id];
    this.areaListAddToDrive = this.areaListAddToDrive.filter((area) => area.id !== areaObject.id);
    this.areaOfInterestList.push(areaObject);
    this.areaOfInterestList.sort((a, b) => (a.id > b.id ? -1 : 1));
    this.currentAreaOfInterestId = 0;
  }

  mapEntityToRequest() {
    return this.cutOffListAddToDrive.map((cutoffModel: CutoffModel) => {
      return new AddObjectiveCutoffRequest(cutoffModel);
    });
  }

  onFinalSubmitDrive() {
    this.submitted = true;
    let areaObject: any = [];
    this.areaListAddToDrive.forEach((area) => {
      let obj = {
        areaOfInterestId: area.id,
        driveId: this.driveId,
        status: Status.Active,
      };
      areaObject.push(obj);
    });

    Object.keys(this.areaOfInterestStagesMap).forEach((key) => {
      if (!areaObject.some((aoi) => aoi.areaOfInterestId == key)) {
        delete this.areaOfInterestStagesMap[key];
      }
    });

    let finalObject = {
      id: this.driveId,
      areaList: areaObject.map((areaOfInterest) => areaOfInterest.areaOfInterestId),
      cutOffList: this.mapEntityToRequest(),
      areaOfInterestStagesMap: this.areaOfInterestStagesMap,
    };

    this.api.onFinalSubmitDrive(finalObject).subscribe({
      next: (data: APIResponseObject) => {
        const messageDialogData = new messageDialog(
          DialogMessages.Success,
          DialogMessages.DriveAdded,
          IconNames.CheckCircleOutline,
          true,
          false,
          MessageDialogButtonNames.OK,
        );
        const config: MatDialogConfig = {
          width: '500px',
          height: '350px',
          disableClose: true,
          data: messageDialogData,
        };
        this.dialog.closeAll();
        this.dialog
          .open(MessageDialogComponent, config)
          .afterClosed()
          .subscribe((result) => {
            this.router.navigate(['/' + PageRoutes.DriveListPage]);
          });
      },
      error: (error: HttpErrorResponse) => {
        const messageDialogData = new messageDialog(
          DialogMessages.Empty,
          error?.error?.message,
          IconNames.ErrorOutline,
          true,
          false,
          MessageDialogButtonNames.OK,
        );
        const config: MatDialogConfig = {
          width: '570px',
          height: '330px',
          disableClose: true,
          data: messageDialogData,
        };
        this.dialog.closeAll();
        this.dialog.open(MessageDialogComponent, config).afterClosed();
        this.submitted = false;
        LoggerService.log(error);
      },
    });
  }

  addDrivePreviewModal() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '78vw';
    dialogConfig.height = '80vh';

    if (
      this.loginType == UserLoginAndRegisrationType.IP &&
      this.registrationType == UserLoginAndRegisrationType.IP
    ) {
      this.addDriveFormGroup.controls[this.formControlVariables.loginIP].enable();
      this.addDriveFormGroup.controls[this.formControlVariables.loginIP].setValue(
        this.addDriveFormGroup.controls[this.formControlVariables.registrationIP].value,
      );
    }
    dialogConfig.data = {
      addDriveFormGroup: this.addDriveFormGroup,
      formFields: this.addFormFieldsFormGroup,
      emailTemplateList: this.emailTemplateList,
      messageTemplateList: this.messageTemplateList,
      areaList: this.areaListAddToDrive,
      cutOffList: this.cutOffListAddToDrive,
      aoiStagesMapList: this.areaOfInterestStagesMap,
      interviewStages: this.interviewStages,
    };

    this.dialog.open(DrivePreviewDialogComponent, dialogConfig);
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    $event.returnValue = LoggerMessages.ReloadMessage;
  }

  addSubject(template: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      headerMessage: `Subject for ${template.name}`,
      titleMessage: InputLable.Subject,
      previousSubject: template.subject,
    };

    const dialogRef = this.dialog.open(AddGroupNameDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.emailTemplateList.forEach((temp) => {
          if (temp.id == template.id) {
            if (this.emailGroupSelected) {
              if (temp.subject !== data) {
                this.showSaveNextEmail = true;
              }
            } else {
              if (temp.subject == '') {
                this.subjectCount += 1;
              }
            }
            temp.subject = data;
          }
        });
      } else {
        if (template.subject == '') {
          if (this.emailGroupSelected) {
            this.subjectCount -= 1;
            this.showSaveNextEmail = true;
          } else {
            this.toastr.error(TosterMessages.PleaseEnterSubject);
          }
        }
      }
    });
  }

  skipToDone() {
    this.resetValue();
  }

  onRequiredFieldChange(event: MatCheckboxChange, controlName: string) {
    this.addFormFieldsFormGroup.controls[controlName].reset(!event.checked);
  }

  async loadTimeSlots() {
    this.api.getAllTimeSlots().subscribe((response: APIResponseObject) => {
      if (response.data != null) {
        this.timeSlots = response.data;
      }
    });
  }

  validate(field: string) {
    if (!this.isAutoCutOffFocusOut) {
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].setValue(
        this.addPaperCutOffFormGroup.controls[this.formControlVariables.autoCutOffMarks].value,
      );
    }

    const cutOffMarksValue = Number.parseInt(
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].value,
    );
    const autoCutOffMarksValue = Number.parseInt(
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.autoCutOffMarks].value,
    );

    if (autoCutOffMarksValue && cutOffMarksValue < autoCutOffMarksValue) {
      this.addPaperCutOffFormGroup.controls[field].markAsTouched();
      this.addPaperCutOffFormGroup.controls[field].setErrors({ incorrect: true });
    } else if (
      autoCutOffMarksValue &&
      cutOffMarksValue > autoCutOffMarksValue &&
      !(
        this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].hasError(
          'pattern',
        ) ||
        this.addPaperCutOffFormGroup.controls[this.formControlVariables.autoCutOffMarks].hasError(
          'pattern',
        )
      )
    ) {
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].setErrors(null);
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.autoCutOffMarks].setErrors(
        null,
      );
    } else {
      this.addPaperCutOffFormGroup.markAllAsTouched();
    }
  }

  checkIsCutOffMarksIsEmpty() {
    this.isAutoCutOffFocusOut = !(
      Number.parseInt(
        this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].value,
      ) != 0 &&
      this.addPaperCutOffFormGroup.controls[this.formControlVariables.cutOffMarks].value == ''
    );
  }

  updateInputData() {
    this.addDriveFormGroup.controls[this.formControlVariables.loginIP].setValue(
      this.addDriveFormGroup.controls[this.formControlVariables.registrationIP].value,
    );
  }

  async getInterviewStages() {
    this.interviewerService.getInitialInterviewStages().subscribe(
      (response: APIResponseObject) => {
        if (response.result) {
          this.interviewStages = [...response.data];
        }
      },
      (error: HttpErrorResponse) => {
        LoggerService.log('Error: ', error);
      },
    );
  }

  changeAreaOfInterest($event: MatSelectChange) {
    let areaId: number = $event.value?.id;
    this.areaOfInterestStagesMap = {
      [areaId]: [...this.interviewStages.map((stage) => stage.id)],
      ...this.areaOfInterestStagesMap,
    };
    this.currentAreaOfInterestId = areaId;
    this.showInterviewStages = true;
    this.stageCheckboxRef.forEach((checkbox) => {
      checkbox.checked = true;
    });
  }

  changeStageStatus($event: MatCheckboxChange) {
    if ($event.checked) {
      this.areaOfInterestStagesMap[this.currentAreaOfInterestId] = [
        ...this.areaOfInterestStagesMap[this.currentAreaOfInterestId],
        Number($event.source.value),
      ];
    } else {
      this.areaOfInterestStagesMap[this.currentAreaOfInterestId] = [
        ...this.areaOfInterestStagesMap[this.currentAreaOfInterestId].filter(
          (stageId) => stageId != Number($event.source.value),
        ),
      ];
    }
    this.areaOfInterestStagesMap[this.currentAreaOfInterestId] = this.areaOfInterestStagesMap[
      this.currentAreaOfInterestId
    ].sort((a, b) => (a < b ? -1 : 1));
  }

  getMessageTemplateDTOList() {
    return this.messageTemplateList.map(
      ({ templateAdded, isEdit, name, type, ...restFields }) => restFields,
    );
  }

  getEmailTemplateDTOList() {
    return this.emailTemplateList.map(
      ({ templateAdded, isEdit, name, type, ...restFields }) => restFields,
    );
  }
}
