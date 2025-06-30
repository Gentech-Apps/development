import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSelectChange } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaperResultStatus } from 'src/app/core/enums/paperResultStatus';
import { IDashboardApiRequest } from 'src/app/core/interface/IDashboardApiRequest';
import { APIResponseObject } from 'src/app/core/interface/apiResponseObject';
import { AreaModel } from 'src/app/core/models/area.model';
import { ExamineeResultModel } from 'src/app/core/models/examineeResult.model';
import { HeaderService } from 'src/app/core/services/header.service';
import { LocalStorageService } from 'src/app/core/services/local.storage.services';
import { LoggerService } from 'src/app/core/services/logger.service';
import { PermissionLevel } from '../../../core/enums/PermissionLevel';
import { MenuService } from '../../../core/services/menu.service';
import { UtilsService } from '../../../core/services/utils.service';
import { UpdateExamineeResultDialogComponent } from '../../dialogs/update-examinee-result-dialog/update-examinee-result-dialog.component';
import { DashboardService } from '../../services/dashboard.service';
import { messageDialog } from '../../../core/models/messageDialog';
import {
  HeaderNames,
  IconNames,
  MessageDialogButtonNames,
  MessageDialogTitles,
} from '../../../core/utils/constants';
import { MessageDialogComponent } from '../../../core/dialog/message-dialog/message-dialog.component';

@Component({
  selector: 'app-examinee-completed-dashboard',
  templateUrl: './examinee-completed-dashboard.component.html',
  styleUrls: ['./examinee-completed-dashboard.component.scss'],
})
export class ExamineeCompletedDashboardComponent {
  @ViewChild(MatSort) sort: MatSort | undefined;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loader: boolean = false;
  page: number = 1;
  size: number = 20;
  totalCount: number = 0;
  keyword: string = '';
  date: string = '';
  areaOfInterestId: number = 0;
  status: string = '';
  dataSource: any;
  userResultList: ExamineeResultModel[] = [];
  infiniteScrollDistance: number = 3;
  displayedColumns: string[] = [
    'name',
    'email',
    'Objective Marks',
    'Objective Result',
    'Subjective Marks',
    'Subjective Result',
    'Exam Date & Time',
    'Final Result',
  ];
  columnList: string[] = [
    'name',
    'email',
    'Objective Marks',
    'Objective Result',
    'Subjective Marks',
    'Subjective Result',
    'Exam Date & Time',
    'Final Result',
  ];
  defaultColumns: string[] = [
    'name',
    'email',
    'Objective Marks',
    'Objective Result',
    'Subjective Marks',
    'Subjective Result',
    'Exam Date & Time',
    'Final Result',
  ];
  columnsControl = new FormControl();
  order: string = '';
  sortBy: string = '';
  areaOfInterestList: AreaModel[] = [];
  areaOfInterestIds = new FormControl();
  access: string = '';

  constructor(
    private menuService: MenuService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private tostr: ToastrService,
    private header: HeaderService,
    private storageService: LocalStorageService,
    private dashboardService: DashboardService,
  ) {
    this.access = this.menuService.getAccess(this.menuService.currentUrl);
    if (!this.utilsService.comparePermissions(this.access, PermissionLevel.VIEW)) {
      this.utilsService.navigateToUnauthorizedPage();
    }
    LoggerService.log('Completed Examinee Dashboard compoennt==>', this.access);
    this.header.changeTitle(HeaderNames.DashboardDescriptionComponent);
  }

  ngOnInit() {
    let userType = this.storageService.getItem('userType');

    let selectedColumns = this.storageService.getItem('completed-dashboard');
    if (selectedColumns?.length > 0) {
      this.displayedColumns = selectedColumns;
    }
    this.columnsControl.patchValue(this.displayedColumns);
    this.route.queryParamMap.subscribe((paramsMap: Params) => {
      let {
        params: { areaOfInterestId, date, status },
      } = paramsMap;
      this.areaOfInterestId = Number.parseInt(areaOfInterestId);
      this.date = date;
      this.status = status;
      this.loadContents();
    });

    this.dashboardService
      .getAreaOfInterestListForFilter(this.date, this.status, this.areaOfInterestId)
      .subscribe(
        (response: APIResponseObject) => {
          if (response.result) {
            this.areaOfInterestList = response.data;
          }
        },
        (err: any) => {
          LoggerService.log('Error ::: ' + err);
        },
      );
  }

  setFilter = (event: MatSelectChange) => {
    this.storageService.setItem('completed-dashboard', event.value);
    if (this.storageService.getItem('completed-dashboard')) {
      this.displayedColumns = this.storageService.getItem('completed-dashboard');
      this.columnsControl.patchValue(this.displayedColumns);
    } else {
      this.displayedColumns = event.value;
    }
  };

  loadContents = () => {
    let dashboardApiRequestObj: IDashboardApiRequest = {
      page: this.page,
      size: this.size,
      areaOfInterestIds:
        this.areaOfInterestIds.value != undefined && this.areaOfInterestIds.value.length > 0
          ? this.areaOfInterestIds.value
          : [this.areaOfInterestId],
      currentDate: this.date,
      keyword: this.keyword,
      status: this.status,
      order: this.order,
      sortBy: this.sortBy,
    };
    if (
      this.totalCount > this.userResultList.length ||
      this.userResultList.length / 20 == 0 ||
      this.keyword != '' ||
      this.page == 1
    ) {
      this.loader = !this.loader;
      this.dashboardService.GetCompletedExamineeDetails(dashboardApiRequestObj).subscribe(
        (res: APIResponseObject) => {
          this.loader = !this.loader;
          if (res.result) {
            this.totalCount = res.data.totalCount;
            if (this.page == 1) {
              this.userResultList = res.data.resultList;
            } else {
              this.userResultList.splice(this.page * 20 - 20, 20, ...res.data.resultList);
            }
            this.dataSource = new MatTableDataSource(this.userResultList);
          } else {
            this.tostr.error(res.message);
          }
        },
        (error: any) => {
          this.loader = !this.loader;
          LoggerService.log('Error =>', error);
        },
      );
    }
  };

  onScrollDown() {
    if (this.totalCount > this.userResultList.length || this.userResultList.length / 20 == 0) {
      this.page = this.page + 1;
      this.loadContents();
    }
  }

  searchPaperCutoff() {
    this.page = 1;
    this.loadContents();
  }

  reloadData() {
    this.page = 1;
    this.userResultList = [];
    this.loadContents();
  }

  sendMailStatus(examineeResult: ExamineeResultModel) {
    const messageDialogData = new messageDialog(
      MessageDialogTitles.Confirmation,
      'Are you sure you want to send ' + examineeResult.finalResult + ' mail to ' + name + '?',
      IconNames.HelpOutline,
      true,
      true,
      MessageDialogButtonNames.YesSure,
    );
    const config: MatDialogConfig = {
      width: '600px',
      height: '450px',
      disableClose: true,
      data: messageDialogData,
    };
    this.dialog.closeAll();
    this.dialog
      .open(MessageDialogComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.sendMail(examineeResult.userId, examineeResult.finalResult);
        }
      });
  }

  sendMail(userId: number, finalResult: string) {
    if (finalResult?.toLowerCase() == PaperResultStatus.QUALIFIED.toLowerCase()) {
      this.dashboardService.sendQualifiedMail([userId]).subscribe(
        (res: APIResponseObject) => {
          if (res.result) {
            this.tostr.success(res.message);
            this.reloadData();
          } else {
            this.tostr.error(res.message);
          }
        },
        (error: any) => {
          LoggerService.log('error==>', error);
        },
      );
    }

    if (finalResult?.toLowerCase() == PaperResultStatus.DISQUALIFIED.toLowerCase()) {
      this.dashboardService.sendDisqualifiedMail([userId]).subscribe(
        (res: APIResponseObject) => {
          if (res.result) {
            this.tostr.success(res.message);
            this.reloadData();
          } else {
            this.tostr.error(res.message);
          }
        },
        (error: any) => {
          LoggerService.log('error==>', error);
        },
      );
    }
  }

  openUpdateResultPopup(examineeResult: ExamineeResultModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = 'fit-content';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      header: examineeResult.firstName + ' ' + examineeResult.lastName + ' Exame Result',
      subjectiveResult: examineeResult.subjectiveResult,
      objectiveResult: examineeResult.objectiveResult,
    };
    const dialogRef = this.dialog.open(UpdateExamineeResultDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res !== undefined && res != null) {
        examineeResult.finalResult = res;
        this.dashboardService.UpdateExameResultStatus(examineeResult).subscribe(
          (res: APIResponseObject) => {
            if (res.result) {
              this.reloadData();
              this.tostr.success(res.message);
            } else {
              this.tostr.error(res.message);
            }
          },
          (error: any) => {
            LoggerService.log('error==>', error);
          },
        );
      }
    });
  }

  sortTableData(sort: Sort) {
    this.order = sort.direction;
    this.sortBy = this.order == '' ? '' : sort.active;
    this.page = 1;
    this.userResultList = [];
    this.loadContents();
  }

  filterAreaOfInterest(event: MatSelectChange) {
    if (
      (event.value.length == 1 && event.value[0] == 0) ||
      event.value.length == this.areaOfInterestList.length + 1
    ) {
      this.areaOfInterestIds.setValue([0, ...this.areaOfInterestList.map((aoi) => aoi.id)]);
    } else {
      this.areaOfInterestIds.setValue([...event.value]);
    }
    this.page = 1;
    this.loadContents();
  }
}
