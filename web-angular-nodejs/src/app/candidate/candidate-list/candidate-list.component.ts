import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderConfig } from '../../core/constants/loader';
import { PossibleDuplicateUsersDialogComponent } from '../../core/dialog/possible-duplicate-users-dialog/possible-duplicate-users-dialog.component';
import { ViewProfileDialogComponent } from '../../core/dialog/view-profile-dialog/view-profile-dialog.component';
import { CanidateStatusForFilter } from '../../core/enums/Candidate';
import { PermissionLevel } from '../../core/enums/PermissionLevel';
import { RegistrationType } from '../../core/enums/RegistrationType';
import { APIResponseObject } from '../../core/interface/apiResponseObject';
import { LoaderConfigInteface } from '../../core/interface/loaderConfig';
import { AreaModel } from '../../core/models/area.model';
import { DriveModel } from '../../core/models/drive.model';
import { UserModel } from '../../core/models/user.model';
import { ExportToCSVService } from '../../core/services/exportToCSV.service';
import { HeaderService } from '../../core/services/header.service';
import { LocalStorageService } from '../../core/services/local.storage.services';
import { LoggerService } from '../../core/services/logger.service';
import { MenuService } from '../../core/services/menu.service';
import { UtilsService } from '../../core/services/utils.service';
import { PermissionLevelType } from '../../core/types/roleAndPermissionTypes';
import { DATE_FORMAT, HeaderNames, LocalStorageKeys } from '../../core/utils/constants';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { ImportUsersDialogComponent } from '../dialogs/import-users-dialog/import-users-dialog.component';
import { CandidateService } from '../services/candidate.service';
import { FormControlVariables } from '../../core/constants.ts/form-control-variables';
import { ResendLoginCredentialsRequest } from '../models/resend-login-credentials-request.model';
import { ExamTypes } from '../../core/enums/examTypes';
import { UpdateAgoraStatusRequest } from '../../core/models/updateagora-request.model';
import { FilteredUserRequest } from '../../core/request/filtered-user-request';
import { UpdateSelectedUserRequest } from '../../core/request/update-selected-user-request';
import { FilteredSelectionRequest } from '../../core/request/filtered-selection-request';
import { ACTIVE_CANDIDATES } from '../constants/constants';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../core/constants/page-constants';
import { getTrimmedValue, isBlank } from '../../core/utils/field-utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
})
export class CandidateListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    protected utilsService: UtilsService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private storageService: LocalStorageService,
    private header: HeaderService,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private router: Router,
    private exportToCSVService: ExportToCSVService,
  ) {
    this.access = this.menuService.getAccess(this.menuService.currentUrl);
    if (!this.utilsService.comparePermissions(this.access, PermissionLevel.VIEW)) {
      this.utilsService.navigateToUnauthorizedPage();
    }
    LoggerService.log('Candidate List component===>', this.access);
    this.header.changeTitle(HeaderNames.CandidatesComponent);
  }

  formControlKeyConstants: FormControlVariables = new FormControlVariables();
  loaderConfig: LoaderConfigInteface = LoaderConfig;
  loader: boolean = false;
  page: number = 1;
  size: number = 20;
  totalCount: number = 0;
  userType: string = '';
  showLoader: boolean = false;
  displayedColumns: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive Name',
    'contact',
    'email',
    'exam Date',
    'agora Status',
    'actions',
  ];
  columnList: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive Name',
    'contact',
    'email',
    'exam Date',
    'registration Type',
    'agora Status',
    'qualification',
    'location',
    'source',
    'whatsApp number',
    'actions',
  ];
  defaultColumns: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive Name',
    'contact',
    'email',
    'exam Date',
    'agora Status',
    'actions',
  ];
  activeUserList: UserModel[] = [];
  columnsControl = new FormControl();
  dataSource: any;
  infiniteScrollDistance: number = 3;
  driveList: DriveModel[] = [];
  allAreaList: AreaModel[] = [];
  areaList: AreaModel[] = [];
  activeDriveExists: boolean = false;
  activeDrive: DriveModel | undefined;
  activeRegistrationDriveExists: boolean = false;
  activeRegistrationDrive: DriveModel | undefined;
  filteredUserRequest: FilteredUserRequest = new FilteredUserRequest();
  filteredSelectionRequest: FilteredSelectionRequest = new FilteredSelectionRequest();
  updateSelectedUserRequest: UpdateSelectedUserRequest = new UpdateSelectedUserRequest();
  inactivationList: number[] = [];
  noRecordAvailable: boolean = false;
  selection = new SelectionModel<UserModel>(true, []);
  selectAllCheckboxChecked: boolean = false;
  notIncludeUserList: number[] = [];
  selectAllCheckboxCheckedPreviously: boolean = false;
  hideSelectAllCheckbox: boolean = false;
  previousFromDate: string | null = '';
  previousToDate: string | null = '';
  exportData: UserModel[] = [];
  order: string = '';
  sortBy: string = '';
  disableButton: boolean = false;
  driveFilterSelected: boolean = false;
  userStatus: string[] = Object.values(CanidateStatusForFilter);
  registrationTypeOptions = Object.values(RegistrationType);
  searchSubject: Subject<string> = new Subject<string>();
  access: string = '';
  PermissionLevel: PermissionLevelType = PermissionLevel;

  requestFormGroup: FormGroup = this.formBuilder.group({
    keyword: [''],
    areaOfInterestId: [0],
    driveId: [0],
    examType: [ExamTypes.ALL_EXAM_DATES],
    fromDate: [''],
    toDate: [''],
    userStatus: [[]],
    registrationType: ['All'],
  });

  ngOnInit() {
    history.pushState(null, '', location.href);
    this.userType = this.storageService.getItem(LocalStorageKeys.UserType);
    let selectedColumns = this.storageService.getItem(LocalStorageKeys.ActiveCandidate);
    if (selectedColumns?.length > 0) {
      this.displayedColumns = selectedColumns;
    }

    this.searchSubject
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((value) => this.filterResult());

    this.columnsControl.patchValue(this.displayedColumns);
    this.getPageDetails();
    this.loadContents();
  }

  selectAll(event: MatCheckboxChange) {
    this.selectAllCheckboxChecked = event.checked;
    this.inactivationList = [];
    this.notIncludeUserList = [];
    this.selectAllCheckboxCheckedPreviously = event.checked;
    this.activeUserList.forEach((user: UserModel) => {
      user.selected = event.checked;
    });
  }

  getPageDetails() {
    this.candidateService.getCandidatePageDetails().subscribe((response: APIResponseObject) => {
      if (response.result) {
        this.driveList = response.data.driveList;
        this.areaList = response.data.areaList;
        this.allAreaList = this.areaList;
        this.driveList.forEach((drive) => {
          if (drive.status == 'Active') {
            this.activeDriveExists = true;
            this.activeDrive = drive;
          }
          if (drive.userRegistrationStatus == 'Active') {
            this.activeRegistrationDriveExists = true;
            this.activeRegistrationDrive = drive;
          }
        });
      } else {
        this.driveList = [];
        this.areaList = [];
      }
    });
  }

  loadContents() {
    this.prepareFilterUserObject();
    if (
      this.totalCount > this.activeUserList.length ||
      this.activeUserList.length / DEFAULT_PAGE_SIZE === 0 ||
      this.page === DEFAULT_PAGE_NUMBER
    ) {
      this.showLoader = true;
      this.candidateService
        .getAllActiveUser(this.filteredUserRequest)
        .subscribe((response: APIResponseObject) => {
          this.showLoader = false;
          if (response.result) {
            this.totalCount = response.data.totalElements;
            //check if select all check box is checked ........................................
            if (
              (this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously) &&
              response.data.content.length > 0
            ) {
              response.data.content.forEach((user: UserModel) => {
                user.selected = true;
              });
            }

            this.noRecordAvailable = this.totalCount === 0;
            if (this.page == DEFAULT_PAGE_NUMBER) {
              this.activeUserList = response.data.content;
              this.hideSelectAllCheckbox = this.activeUserList.length === 0;
            } else {
              this.activeUserList.splice(
                this.page * DEFAULT_PAGE_SIZE - DEFAULT_PAGE_SIZE,
                DEFAULT_PAGE_SIZE,
                ...response.data.content,
              );
            }
            this.dataSource = new MatTableDataSource(this.activeUserList);
          } else {
            this.activeUserList = [];
          }
        });
    }
  }

  onScrollDown() {
    if (
      this.totalCount > this.activeUserList.length ||
      this.activeUserList.length / DEFAULT_PAGE_SIZE == 0
    ) {
      this.page = this.page + 1;
      this.loadContents();
    }
  }

  setFilter(event: MatSelectChange) {
    let column: string[] = event.value;
    this.storageService.setItem(LocalStorageKeys.ActiveCandidate, Array.from(new Set(column)));
    if (this.storageService.getItem(LocalStorageKeys.ActiveCandidate)) {
      this.displayedColumns = this.storageService.getItem(LocalStorageKeys.ActiveCandidate);
      this.columnsControl.patchValue(this.displayedColumns);
    } else {
      this.displayedColumns = event.value;
    }
  }

  onChangeDrive(event: MatSelectChange) {
    if (event.value == 0) {
      this.areaList = this.allAreaList;
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].setValue(0);
      this.filterResult();
    } else {
      this.candidateService
        .getAreaOfInterestByDriveId([event.value])
        .subscribe((response: APIResponseObject) => {
          if (response.result) {
            this.areaList = response.data.filter(
              (value: any, index: any, self: any[]) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.place === value.place && t.name === value.name, //remove duplicates from array
                ),
            );
          } else {
            this.areaList = [];
          }
          this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].setValue(0);
          this.filterResult();
        });
    }
  }

  filterResult() {
    this.page = 1;
    this.inactivationList = [];
    this.selectAllCheckboxChecked = false;
    this.selectAllCheckboxCheckedPreviously = false;
    this.notIncludeUserList = [];
    this.loadContents();
  }

  prepareFilterUserObject() {
    this.filteredUserRequest.keyword = getTrimmedValue(
      this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value,
    );
    this.filteredUserRequest.page = this.page;
    this.filteredUserRequest.size = this.size;
    this.filteredUserRequest.examType =
      this.requestFormGroup.controls[this.formControlKeyConstants.examType].value;
    this.filteredUserRequest.areaOfInterestId =
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
    this.filteredUserRequest.driveId =
      this.requestFormGroup.controls[this.formControlKeyConstants.driveId].value;
    this.driveFilterSelected = this.filteredUserRequest.driveId != 0;
    this.filteredUserRequest.fromDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].value;
    this.filteredUserRequest.toDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    this.filteredUserRequest.sortBy = this.sortBy;
    this.filteredUserRequest.order = this.order;
    this.filteredUserRequest.status = isBlank(
      this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value,
    )
      ? ''
      : this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value?.join(',');
    this.filteredUserRequest.registrationType =
      this.requestFormGroup.controls[this.formControlKeyConstants.registrationType].value;
  }

  prepareFilteredSelectionObject() {
    this.filteredSelectionRequest.allSelected =
      this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously;
    this.filteredSelectionRequest.keyword = getTrimmedValue(
      this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value,
    );
    this.filteredSelectionRequest.examType =
      this.requestFormGroup.controls[this.formControlKeyConstants.examType].value;
    this.filteredSelectionRequest.areaOfInterestId =
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
    this.filteredSelectionRequest.driveId =
      this.requestFormGroup.controls[this.formControlKeyConstants.driveId].value;
    this.filteredSelectionRequest.fromDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].value;
    this.filteredSelectionRequest.toDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    this.filteredSelectionRequest.sortBy = this.sortBy;
    this.filteredSelectionRequest.order = this.order;
    this.filteredSelectionRequest.status = isBlank(
      this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value,
    )
      ? ''
      : this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value?.join(',');
    this.filteredSelectionRequest.registrationType =
      this.requestFormGroup.controls[this.formControlKeyConstants.registrationType].value;
    this.filteredSelectionRequest.notIncludedIdList = this.notIncludeUserList;
    this.filteredSelectionRequest.includedIdList = this.inactivationList;
  }

  onSelectFromDate(event: any) {
    let dateFormat = this.datePipe.transform(event.value, DATE_FORMAT);
    this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].reset(dateFormat);
  }

  onSelectToDate(event: any) {
    let dateFormat = this.datePipe.transform(event.value, DATE_FORMAT);
    this.requestFormGroup.controls[this.formControlKeyConstants.toDate].reset(dateFormat);

    let toDate: string = this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    if (toDate !== null && toDate !== '') {
      this.previousFromDate =
        this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].value;
      this.previousToDate =
        this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
      this.filterResult();
    }
  }

  addUser() {
    if (this.activeDriveExists || this.activeRegistrationDriveExists) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.maxHeight = '93vh';
      dialogConfig.width = '500px';
      dialogConfig.data = {
        driveList: this.driveList,
        edit: false,
        driveData: this.activeDriveExists ? this.activeDrive : this.activeRegistrationDrive,
      };

      const dialogRef = this.dialog.open(AddUserDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.filterResult();
        }
      });
    } else {
      this.toastr.error('At least one drive should be enabled.');
    }
  }

  editUser(user: UserModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      driveList: this.driveList,
      edit: true,
      userData: Object.assign({}, user),
    };

    const dialogRef = this.dialog.open(AddUserDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.filterResult();
      }
    });
  }

  viewProfile(user: UserModel, option: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = option == 'image' ? '450px' : '600px';
    dialogConfig.width = option == 'image' ? '500px' : '60%';
    dialogConfig.data = {
      userId: user.id,
      firstName: user.firstName + ' ' + user.lastName,
      status: option,
      isReferral: false,
    };

    this.dialog.open(ViewProfileDialogComponent, dialogConfig);
  }

  importUsers() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = 'fit-content';
    dialogConfig.minWidth = '500px';
    dialogConfig.maxWidth = 'fit-content';
    dialogConfig.data = {
      driveList: this.driveList,
      areaOfInterestList: this.allAreaList,
    };

    const dialogRef = this.dialog.open(ImportUsersDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.filterResult();
      }
    });
  }

  addUserToInactivationList(event: MatCheckboxChange, user: UserModel) {
    user.selected = event.checked ? true : false;

    if (event.checked) {
      let index = this.inactivationList.findIndex((x) => x == user.id);
      if (index < 0) {
        this.inactivationList.push(user.id);
      }

      //check if id exists in notSelectedUserList ..........................................
      if (this.notIncludeUserList.length > 0) {
        this.notIncludeUserList = this.notIncludeUserList.filter((x) => x !== user.id);
      }

      //check if all checkbox are checked ......................................
      if (this.inactivationList.length == this.totalCount) {
        this.selectAllCheckboxChecked = true;
        this.selectAllCheckboxCheckedPreviously = true;
        this.notIncludeUserList = [];
        this.inactivationList = [];
      }

      //if select all checkbox was checked previously , check if select all can be checked .....................
      if (this.selectAllCheckboxCheckedPreviously) {
        if (!this.activeUserList.some((user) => user.selected == false)) {
          //if no checbox is unchecked .....................
          this.selectAllCheckboxChecked = true;
          this.inactivationList = [];
          this.notIncludeUserList = [];
        }
      }
    } else {
      this.inactivationList = this.inactivationList.filter((x) => x !== user.id);

      if (this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously) {
        this.selectAllCheckboxChecked = false;
        let index = this.notIncludeUserList.findIndex((x) => x == user.id);
        if (index < 0) {
          this.notIncludeUserList.push(user.id);
        }
      }

      //check if no checkbox is checked .......................
      if (!this.activeUserList.some((user) => user.selected == true)) {
        this.selectAllCheckboxChecked = false;
        this.selectAllCheckboxCheckedPreviously = false;
        this.inactivationList = [];
        this.notIncludeUserList = [];
      }
    }
  }

  inactivateUsers() {
    this.disableButton = true;
    this.updateSelectedUserRequest.examType =
      this.requestFormGroup.controls[this.formControlKeyConstants.examType].value;
    this.updateSelectedUserRequest.registrationType =
      this.requestFormGroup.controls[this.formControlKeyConstants.registrationType].value;
    this.updateSelectedUserRequest.keyword =
      this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value.trim();
    this.updateSelectedUserRequest.areaOfInterestId =
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
    this.updateSelectedUserRequest.driveId =
      this.requestFormGroup.controls[this.formControlKeyConstants.driveId].value;
    this.updateSelectedUserRequest.fromDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].value;
    this.updateSelectedUserRequest.toDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    this.updateSelectedUserRequest.status = isBlank(
      this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value,
    )
      ? ''
      : this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value?.join(',');
    if (this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously) {
      this.updateSelectedUserRequest.allSelected = true;
      this.updateSelectedUserRequest.includedIdList = this.inactivationList;
      this.updateSelectedUserRequest.notIncludedIdList = this.notIncludeUserList;
    } else {
      this.updateSelectedUserRequest.allSelected = false;
      this.updateSelectedUserRequest.includedIdList = this.inactivationList;
      this.updateSelectedUserRequest.notIncludedIdList = [];
    }

    this.updateSelectedUserRequest.typeOfUser = ACTIVE_CANDIDATES;

    this.candidateService.adminInactivateUsers(this.updateSelectedUserRequest).subscribe({
      next: (response: APIResponseObject) => {
        if (response.result) {
          this.toastr.success(response?.message?.description);
          this.inactivationList = [];
          this.notIncludeUserList = [];
          this.selectAllCheckboxChecked = false;
          this.selectAllCheckboxCheckedPreviously = false;
          this.page = 1;
          this.loadContents();
        } else {
          this.toastr.error(response?.message?.description);
        }
        this.disableButton = false;
      },
      error: (error: HttpErrorResponse) => {
        this.disableButton = false;
        const message = error?.error.message?.description ?? error?.error?.message;
        this.toastr.error(message);
      },
    });
  }

  updateAgoraStatus(event: MatSlideToggleChange, user: UserModel) {
    user.agoraStatus = event.checked ? 'Restricted' : 'Unrestricted';
    const request = new UpdateAgoraStatusRequest();
    request.id = user.id;
    request.agoraStatus = user.agoraStatus;
    this.candidateService
      .adminUpdateAgoraStatus(request)
      .subscribe((response: APIResponseObject) => {
        if (response.result) {
          this.toastr.success(response?.message);
        } else {
          this.toastr.error(response?.message);
          event.source.checked = !event.checked;
        }
      });
  }

  showPossibleDuplicateUsers(user: UserModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1135px';
    dialogConfig.data = {
      user: user,
      drives: this.driveList,
      from: 'candidate-list',
      access: this.access,
    };

    const dialogRef = this.dialog.open(PossibleDuplicateUsersDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContents();
      }
    });
  }

  loadDuplicateUsers() {
    this.router.navigate(['/candidates/duplicate-user-list']);
  }

  clearDate(event: MouseEvent) {
    event.stopPropagation();
    this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].reset('');
    this.requestFormGroup.controls[this.formControlKeyConstants.toDate].reset('');
    this.filterResult();
  }

  sortTableData(sort: Sort) {
    this.order = sort.direction;
    this.sortBy = this.order == '' ? '' : sort.active;
    this.page = 1;
    this.activeUserList = [];
    this.loadContents();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    history.go(history.length);
  }

  onFocusOutDate() {
    let toDate: string = this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    if (toDate == null || toDate == '') {
      this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].reset(
        this.previousFromDate,
      );
      this.requestFormGroup.controls[this.formControlKeyConstants.toDate].reset(
        this.previousToDate,
      );
    }
  }

  resendMail() {
    const resendMailRequest: ResendLoginCredentialsRequest = new ResendLoginCredentialsRequest();
    resendMailRequest.allSelected =
      this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously;
    resendMailRequest.includedIdList = this.inactivationList;
    resendMailRequest.notIncludedIdList = this.notIncludeUserList;
    resendMailRequest.keyword =
      this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value.trim();
    resendMailRequest.examType =
      this.requestFormGroup.controls[this.formControlKeyConstants.examType].value;
    resendMailRequest.areaOfInterestId =
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
    resendMailRequest.driveId =
      this.requestFormGroup.controls[this.formControlKeyConstants.driveId].value;
    resendMailRequest.fromDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.fromDate].value;
    resendMailRequest.toDate =
      this.requestFormGroup.controls[this.formControlKeyConstants.toDate].value;
    resendMailRequest.status = isBlank(
      this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value,
    )
      ? ''
      : this.requestFormGroup.controls[this.formControlKeyConstants.userStatus].value?.join(',');
    resendMailRequest.registrationType =
      this.requestFormGroup.controls[this.formControlKeyConstants.registrationType].value;

    this.showLoader = true;
    this.disableButton = true;
    this.candidateService
      .resendLoginCreadentials(resendMailRequest)
      .subscribe((response: APIResponseObject) => {
        this.inactivationList = [];
        this.showLoader = false;
        this.activeUserList.forEach((user: UserModel) => {
          user.selected = false;
        });
        this.selection.clear();
        this.selectAllCheckboxChecked = false;
        this.notIncludeUserList = [];
        this.selectAllCheckboxCheckedPreviously = false;

        if (response.result) {
          this.toastr.success(response?.message);
        } else {
          this.toastr.error('Internal server error.');
        }
        this.disableButton = false;
      });
  }

  downloadCSV() {
    this.showLoader = true;
    this.disableButton = true;
    this.prepareFilteredSelectionObject();
    this.candidateService.getExportUsersList(this.filteredSelectionRequest).subscribe(
      (response: APIResponseObject) => {
        this.showLoader = false;
        this.disableButton = false;
        if (response.result) {
          response.data?.forEach((user: UserModel) => {
            user.examDate = moment(new Date(user.examDate)).format('DD/MM/YYYY');
          });

          this.exportData = response.data;
          this.exportToCSVService.downloadFile(this.exportData, 'usersListData', [
            'firstName',
            'lastName',
            'areaOfInterestName',
            'driveName',
            'email',
            'mobileNumber',
            'examDate',
            'agoraStatus',
            'qualification',
            'source',
            'location',
            'whatsappNumber',
          ]);
          this.exportData = [];
        } else {
          this.exportData = [];
        }
      },
      (error: any) => {
        this.showLoader = false;
        this.disableButton = false;
      },
    );
  }
  changeText(str: string) {
    str = str.split(/(?=[A-Z])/).join(' ');
    return str;
  }

  searchByText(event: KeyboardEvent) {
    if (!this.showLoader) {
      const keyword = this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value;
      this.searchSubject.next(keyword);
    } else {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
}
