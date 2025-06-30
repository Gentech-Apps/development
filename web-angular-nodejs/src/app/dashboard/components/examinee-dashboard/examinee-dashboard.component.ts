import { Component, HostListener, ViewChild } from '@angular/core';
import { HeaderService } from '../../../core/services/header.service';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { _MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IDashboardApiRequest } from '../../../core/interface/IDashboardApiRequest';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { AreaModel } from '../../../core/models/area.model';
import { DashbordDetailsModel } from '../../../core/models/dashboardDetails.model';
import { DatePipe } from '@angular/common';
import { LoggerService } from '../../../core/services/logger.service';
import { MenuService } from '../../../core/services/menu.service';
import { PermissionLevel } from '../../../core/enums/PermissionLevel';
import { UtilsService } from '../../../core/services/utils.service';
import { DATE_FORMAT, HeaderNames } from '../../../core/utils/constants';

@Component({
  selector: 'app-examinee-dashboard',
  templateUrl: './examinee-dashboard.component.html',
  styleUrls: ['./examinee-dashboard.component.scss'],
})
export class ExamineeDashboardComponent {
  @ViewChild(MatSort) sort: MatSort | undefined;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loader: boolean = false;
  page: number = 1;
  size: number = 20;
  totalCount: number = 0;
  fromDate: string = 'All';
  toDate: string = 'All';
  areaOfInterestId: number = 0;
  areaOfInterestList: AreaModel[] = [];
  dataSource: any;
  infiniteScrollDistance: number = 3;
  dashboardDetailsList: DashbordDetailsModel[] = [];
  totalRegistrations: number = 0;
  totalExaminee: number = 0;
  totalNotAppeared: number = 0;
  totalActive: number = 0;
  totalInctive: number = 0;
  totalCompleted: number = 0;
  totalAppeared: number = 0;
  startDate: string = '';
  endDate: string = '';
  order: string = '';
  sortBy: string = '';
  displayedColumns: string[] = [
    'exam Date',
    'total registrations',
    'total examinee',
    'appeared Examinee',
    'completed Examinee',
    'active Examinee',
    'inactive Examinee',
    'not Appeared Examinee',
  ];
  columnList: string[] = [
    'exam Date',
    'total registrations',
    'total examinee',
    'appeared Examinee',
    'completed Examinee',
    'active Examinee',
    'inactive Examinee',
    'not Appeared Examinee',
  ];
  defaultColumns: string[] = [
    'exam Date',
    'total registrations',
    'total examinee',
    'appeared Examinee',
    'completed Examinee',
    'active Examinee',
    'inactive Examinee',
    'not Appeared Examinee',
  ];
  columnsControl = new FormControl();
  displayFooterColumns: string[] = [
    'EXAM DATE',
    'TOTAL REGISTRATIONS',
    'TOTAL EXAMINEE',
    'APPEARED EXAMINEE',
    'COMPLETED EXAMINEE',
    'ACTIVE EXAMINEE',
    'INACTIVE EXAMINEE',
    'NOT APPEARED EXAMINEE',
  ];
  access: string = '';

  constructor(
    private menuService: MenuService,
    private utilsService: UtilsService,
    private router: Router,
    private datePipe: DatePipe,
    private tostr: ToastrService,
    private storageService: LocalStorageService,
    private dashboardService: DashboardService,
    private header: HeaderService,
  ) {
    this.access = this.menuService.getAccess(this.menuService.currentUrl);
    if (!this.utilsService.comparePermissions(this.access, PermissionLevel.VIEW)) {
      this.utilsService.navigateToUnauthorizedPage();
    }
    LoggerService.log('Dashboard compoennt==>', this.access);
    this.header.changeTitle(HeaderNames.DashboardComponent);
  }

  ngOnInit() {
    history.pushState(null, '', location.href);
    let selectedColumns = this.storageService.getItem('dashboard');
    if (selectedColumns?.length > 0) {
      this.displayedColumns = selectedColumns;
    }
    this.columnsControl.patchValue(this.displayedColumns);
    this.loadContents();
  }

  ngAfterViewInit() {
    this.getListOfAreaOfInterest();
  }

  setFilter(event: MatSelectChange) {
    this.storageService.setItem('dashboard', event.value);
    if (this.storageService.getItem('dashboard')) {
      this.displayedColumns = this.storageService.getItem('dashboard');
      this.displayFooterColumns = this.displayedColumns.map((column: string) =>
        column.toUpperCase(),
      );
      this.columnsControl.patchValue(this.displayedColumns);
    } else {
      this.displayedColumns = event.value;
    }
  }

  onScrollDown() {
    this.page = this.page + 1;
    this.loadContents();
  }

  clearDate(event: MouseEvent) {
    LoggerService.log(this.startDate, this.endDate);
    event.stopPropagation();
    this.fromDate = 'All';
    this.toDate = 'All';
    this.startDate = '';
    this.endDate = '';
    this.page = 1;
    this.loadContents();
  }

  onDateChange() {
    const fromDate = this.datePipe.transform(this.startDate, DATE_FORMAT);
    const toDate = this.datePipe.transform(this.endDate, DATE_FORMAT);
    if (fromDate != null && toDate != null) {
      this.fromDate = fromDate;
      this.toDate = toDate;
      this.page = 1;
      this.loadContents();
    }
  }

  onAreaInerestChange(event: MatSelectChange) {
    this.areaOfInterestId = event.value;
    this.page = 1;
    this.loadContents();
  }

  getListOfAreaOfInterest() {
    this.dashboardService.GetAreaOfInterestList().subscribe(
      (res: APIResponseObject) => {
        if (res.result) {
          this.areaOfInterestList = res?.data;
        } else {
          this.tostr.error(res.message);
        }
      },
      (error: any) => {
        LoggerService.log('Error ==> ', error);
      },
    );
  }

  loadContents() {
    let dashboardApiRequestObj: IDashboardApiRequest = {
      page: this.page,
      size: this.size,
      areaOfInterestIds: [this.areaOfInterestId],
      fromDate: this.fromDate,
      toDate: this.toDate,
      order: this.order,
      sortBy: this.sortBy,
    };
    if (
      this.dashboardDetailsList.length / 20 == 0 ||
      this.fromDate != '' ||
      this.page == 1 ||
      this.areaOfInterestId != 0
    ) {
      this.loader = !this.loader;
      this.dashboardService.GetDashboardDetails(dashboardApiRequestObj).subscribe(
        (res: APIResponseObject) => {
          this.loader = !this.loader;
          if (res?.result) {
            this.totalCount = res.data?.totalExameDate;
            this.totalExaminee = res.data.total;
            this.totalRegistrations = Number(res.data.totalRegistration);
            this.totalAppeared = res.data.appeared;
            this.totalInctive = res.data.inactive;
            this.totalCompleted = res.data.completed;
            this.totalActive = res.data.active;
            this.totalNotAppeared = res.data.notAppeared;
            if (this.page == 1) {
              this.dashboardDetailsList =
                this.totalCount > 0
                  ? this.appendDatesThosearenotPresentInListwithZeroCount(res.data?.dashboardData)
                  : [];
            } else {
              this.dashboardDetailsList.splice(this.page * 20 - 20, 20, ...res.data?.dashboardData);
              this.dashboardDetailsList = this.appendDatesThosearenotPresentInListwithZeroCount(
                this.dashboardDetailsList,
              );
            }
            this.dataSource = new _MatTableDataSource(this.dashboardDetailsList);
          } else {
            this.tostr.error(res.message);
          }
        },
        (error: any) => {
          this.loader = !this.loader;
          LoggerService.error(error);
        },
      );
    } else {
      LoggerService.info('You have exceed the total limit');
    }
  }

  appendDatesThosearenotPresentInListwithZeroCount(dashboardDetailsList: DashbordDetailsModel[]) {
    let dateList: string[] = [];
    dashboardDetailsList.forEach((element: DashbordDetailsModel) => {
      dateList.push(element.examDate);
    });

    const dateArray = dateList.map((date) => moment(date));
    dateArray.sort(function (left, right) {
      return moment.utc(left).diff(moment.utc(right));
    });

    let fromDate =
      this.fromDate === 'All' ? dateArray[dateArray.length - 1].toDate() : this.fromDate;
    let toDate = this.toDate === 'All' ? dateArray[0].toDate() : this.toDate;
    let startDate: Date = new Date(fromDate);
    let endDate: Date = new Date(toDate);
    while (endDate <= startDate) {
      let date: string = this.datePipe.transform(endDate, DATE_FORMAT) ?? '';
      if (!dateList.includes(date)) {
        dashboardDetailsList.push({
          examDate: date,
          date: date.replaceAll('-', '/'),
          total: 0,
          totalRegistration: Number('0'),
          active: 0,
          inactive: 0,
          adminLogout: 0,
          back: 0,
          completed: 0,
          appeared: 0,
          notAppeared: 0,
          focussedOut: 0,
        });
      }
      endDate.setDate(endDate.getDate() + 1);
    }
    dashboardDetailsList.sort((a: DashbordDetailsModel, b: DashbordDetailsModel) => {
      return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
    });
    return dashboardDetailsList;
  }

  loadData(date: string, status: string, totalCount: number) {
    if (totalCount > 0) {
      const queryParams = {
        date,
        status,
        areaOfInterestId: this.areaOfInterestId,
      };
      if (status != 'completed') {
        this.router.navigate(['/dashboard/examinee-deatil-description'], { queryParams });
      } else {
        this.router.navigate(['/dashboard/completed-examinee-description'], { queryParams });
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    history.go(history.length);
  }
}
