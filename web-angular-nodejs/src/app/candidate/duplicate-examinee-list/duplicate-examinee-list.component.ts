import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ViewProfileDialogComponent } from '../../core/dialog/view-profile-dialog/view-profile-dialog.component';
import { APIResponseObject } from '../../core/interface/apiResponseObject';
import { AreaModel } from '../../core/models/area.model';
import { UserModel } from '../../core/models/user.model';
import { HeaderService } from '../../core/services/header.service';
import { LocalStorageService } from '../../core/services/local.storage.services';
import { LoggerService } from '../../core/services/logger.service';
import { PermissionLevel } from '../../core/enums/PermissionLevel';
import { MenuService } from '../../core/services/menu.service';
import { UtilsService } from '../../core/services/utils.service';
import { PermissionLevelType } from '../../core/types/roleAndPermissionTypes';
import { CandidateService } from '../services/candidate.service';
import { HeaderNames, RegistrationTypeOptions } from '../../core/utils/constants';
import { FormControlVariables } from '../../core/constants.ts/form-control-variables';
import { DuplicateUserRequest } from '../models/duplicate-user-request';
import { UpdateSelectedUserRequest } from '../../core/request/update-selected-user-request';
import { DUPLICATE_CANDIDATE } from '../constants/constants';
import { getTrimmedValue } from '../../core/utils/field-utils';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../core/constants/page-constants';

@Component({
  selector: 'app-duplicate-examinee-list',
  templateUrl: './duplicate-examinee-list.component.html',
  styleUrls: ['./duplicate-examinee-list.component.scss'],
})
export class DuplicateExamineeListComponent {
  userList: UserModel[] = [];
  areaList: AreaModel[] = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  showLoader: boolean = false;
  loader: boolean = false;
  page: number = 1;
  size: number = 20;
  totalCount: number = 0;
  displayedColumns: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive name',
    'Contact',
    'email',
    'exam Date',
    'user status',
    'actions',
  ];
  columnList: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive name',
    'Contact',
    'email',
    'exam Date',
    'user status',
    'actions',
  ];
  defaultColumns: string[] = [
    'checkbox',
    'name',
    'area Of Interest',
    'drive name',
    'Contact',
    'email',
    'exam Date',
    'user status',
    'actions',
  ];
  columnsControl = new FormControl();
  dataSource: any;
  infiniteScrollDistance: number = 3;
  getDuplicateUserRequest: DuplicateUserRequest = new DuplicateUserRequest();
  updateSelectedUserRequest: UpdateSelectedUserRequest = new UpdateSelectedUserRequest();
  inactivationList: number[] = [];
  noRecordAvailable: boolean = false;
  selection = new SelectionModel<UserModel>(true, []);
  selectAllCheckboxChecked: boolean = false;
  notIncludeUserList: number[] = [];
  selectAllCheckboxCheckedPreviously: boolean = false;
  hideSelectAllCheckbox: boolean = false;
  activeUserCount: number = 0;
  sortBy: string = '';
  order: string = '';
  disableButton: boolean = false;
  aoiFilterSelected: boolean = false;
  access: string = '';
  PermissionLevel: PermissionLevelType = PermissionLevel;

  formControlKeyConstants: FormControlVariables = new FormControlVariables();

  requestFormGroup: FormGroup = this.formBuilder.group({
    keyword: [''],
    areaOfInterestId: [0],
  });

  constructor(
    protected utilsService: UtilsService,
    private menuService: MenuService,
    private tostr: ToastrService,
    private formBuilder: FormBuilder,
    private storageService: LocalStorageService,
    private header: HeaderService,
    private candidateService: CandidateService,
    private dialog: MatDialog,
  ) {
    this.access = this.menuService.getAccess(this.menuService.currentUrl);
    if (!this.utilsService.comparePermissions(this.access, PermissionLevel.VIEW)) {
      this.utilsService.navigateToUnauthorizedPage();
    }
    LoggerService.log('Duplicate Examinee List  ===>', this.access);
    this.header.changeTitle(HeaderNames.DuplicateCandidatesListComponent);
  }

  ngOnInit() {
    let selectedColumns = this.storageService.getItem('duplicate-candidate');
    if (selectedColumns?.length > 0) {
      this.displayedColumns = selectedColumns;
    }
    this.columnsControl.patchValue(this.displayedColumns);
    this.loadAreas();
    this.loadContents();
  }

  selectAll(event: MatCheckboxChange) {
    this.selectAllCheckboxChecked = event.checked ? true : false;
    this.inactivationList = [];
    this.notIncludeUserList = [];
    this.selectAllCheckboxCheckedPreviously = event.checked ? true : false;
    this.userList.forEach((user: UserModel) => {
      user.selected = event.checked ? true : false;
    });
  }

  loadAreas() {
    this.candidateService.getAllAreas().subscribe((response: APIResponseObject) => {
      if (response.result) {
        this.areaList = response.data;
      } else {
        this.areaList = [];
      }
    });
  }

  loadContents() {
    if (
      this.totalCount > this.userList.length ||
      this.userList.length / DEFAULT_PAGE_SIZE == 0 ||
      this.page == DEFAULT_PAGE_NUMBER
    ) {
      this.showLoader = true;
      this.updateSelectedUserRequest.keyword = getTrimmedValue(
        this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value,
      );
      this.updateSelectedUserRequest.registrationType = getTrimmedValue(
        this.requestFormGroup.controls[this.formControlKeyConstants.registrationType]?.value,
      );
      this.updateSelectedUserRequest.areaOfInterestId =
        this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
      this.updateSelectedUserRequest.registrationType = RegistrationTypeOptions.All;
      this.aoiFilterSelected = this.updateSelectedUserRequest.areaOfInterestId != 0;
      this.getDuplicateUserRequest.page = this.page;
      this.getDuplicateUserRequest.size = this.size;
      this.getDuplicateUserRequest.keyword = getTrimmedValue(
        this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value,
      );
      this.getDuplicateUserRequest.areaOfInterestId =
        this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
      this.getDuplicateUserRequest.sortBy = this.sortBy;
      this.getDuplicateUserRequest.order = this.order;

      this.candidateService
        .getAllDuplicateUserList(this.getDuplicateUserRequest)
        .subscribe((response: APIResponseObject) => {
          this.showLoader = false;
          if (response.result) {
            this.totalCount = response.data.totalElements;
            this.activeUserCount = response.data.activeUserCount;
            this.hideSelectAllCheckbox = this.activeUserCount > 0 ? false : true;
            //check if select all check box is checked ........................................
            if (
              (this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously) &&
              response.data.duplicateUserList.length > 0
            ) {
              response.data.duplicateUserList.forEach((user: UserModel) => {
                user.selected = true;
              });
            }
            this.noRecordAvailable = this.totalCount > 0 ? false : true;
            if (this.page == 1) {
              this.userList = response.data.duplicateUserList;
            } else {
              this.userList.splice(this.page * 20 - 20, 20, ...response.data.duplicateUserList);
            }
            this.dataSource = new MatTableDataSource(this.userList);
          } else {
            this.userList = [];
          }
        });
    }
  }

  searchDuplicateUser() {
    this.page = 1;
    this.inactivationList = [];
    this.selectAllCheckboxChecked = false;
    this.selectAllCheckboxCheckedPreviously = false;
    this.notIncludeUserList = [];
    this.updateSelectedUserRequest.allSelected = false;
    this.updateSelectedUserRequest.notIncludedIdList = [];
    this.updateSelectedUserRequest.includedIdList = [];
    this.loadContents();
  }

  onScrollDown() {
    if (this.totalCount > this.userList.length || this.userList.length / 20 == 0) {
      this.page = this.page + 1;
      this.loadContents();
    }
  }

  setFilter(event: MatSelectChange) {
    this.storageService.setItem('duplicate-candidate', event.value);
    if (this.storageService.getItem('duplicate-candidate')) {
      this.displayedColumns = this.storageService.getItem('duplicate-candidate');
      this.columnsControl.patchValue(this.displayedColumns);
    } else {
      this.displayedColumns = event.value;
    }
  }

  viewUserProfile(user: UserModel, option: string) {
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
      if (this.inactivationList.length == this.activeUserCount) {
        this.selectAllCheckboxChecked = true;
        this.selectAllCheckboxCheckedPreviously = true;
        this.notIncludeUserList = [];
        this.inactivationList = [];
      }

      //if select all checkbox was checked previously , check if select all can be checked .....................
      if (this.selectAllCheckboxCheckedPreviously) {
        if (
          !this.userList.find(
            (user: UserModel) => user.userStatus == 'Active' && user.selected !== true,
          )
        ) {
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
      if (
        !this.userList.find(
          (user: UserModel) => user.userStatus == 'Active' && user.selected == true,
        )
      ) {
        this.selectAllCheckboxChecked = false;
        this.selectAllCheckboxCheckedPreviously = false;
        this.inactivationList = [];
        this.notIncludeUserList = [];
      }
    }
  }

  inactivateDuplicateUser() {
    this.updateSelectedUserRequest.keyword =
      this.requestFormGroup.controls[this.formControlKeyConstants.keyword].value.trim();
    this.updateSelectedUserRequest.areaOfInterestId =
      this.requestFormGroup.controls[this.formControlKeyConstants.areaOfInterestId].value;
    if (this.selectAllCheckboxChecked || this.selectAllCheckboxCheckedPreviously) {
      this.updateSelectedUserRequest.allSelected = true;
      this.updateSelectedUserRequest.includedIdList = this.inactivationList;
      this.updateSelectedUserRequest.notIncludedIdList = this.notIncludeUserList;
    } else {
      this.updateSelectedUserRequest.allSelected = false;
      this.updateSelectedUserRequest.includedIdList = this.inactivationList;
      this.updateSelectedUserRequest.notIncludedIdList = [];
    }

    this.updateSelectedUserRequest.typeOfUser = DUPLICATE_CANDIDATE;
    this.disableButton = true;

    this.candidateService.adminInactivateUsers(this.updateSelectedUserRequest).subscribe(
      (response: APIResponseObject) => {
        if (response.result) {
          this.tostr.success(response.message.description);
          this.inactivationList = [];
          this.notIncludeUserList = [];
          this.selectAllCheckboxChecked = false;
          this.selectAllCheckboxCheckedPreviously = false;
          this.page = 1;
          this.loadContents();
        } else {
          this.tostr.success(response.message.description);
        }
        this.disableButton = false;
      },
      (error: any) => {
        LoggerService.error(error);
        this.disableButton = false;
      },
    );
  }

  sortTableData(sort: Sort) {
    this.order = sort.direction;
    this.sortBy = this.order == '' ? '' : sort.active;
    this.page = 1;
    this.loadContents();
  }
  changeReasonOfLogoutText(str: string) {
    str = str.split(/(?=[A-Z])/).join(' ');
    return str;
  }
}
