import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DriveModel } from 'src/app/core/models/drive.model';
import { CandidateService } from '../../services/candidate.service';
import { APIResponseObject } from 'src/app/core/interface/apiResponseObject';
import { BulkImportModel } from '../../models/bulk-import.model';
import { ExcelService } from '../../services/export-to-excel.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { ImportUsersPreviewDialogComponent } from '../import-users-preview-dialog/import-users-preview-dialog.component';
import { columnForImportUserOptions } from 'src/app/core/utils/constants';
import { ImportXlxsFile } from 'src/app/core/services/importXLXS.service';
import { excelDateToJSDate, excelTimeToJSTime } from 'src/app/core/utils/commonFunction';
import { ImportUser } from '../../models/import-user.model';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AreaModel } from 'src/app/core/models/area.model';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-import-users-dialog',
  templateUrl: './import-users-dialog.component.html',
  styleUrls: ['./import-users-dialog.component.scss'],
})
export class ImportUsersDialogComponent {
  driveList: DriveModel[] = [];
  importFile: any;
  importObject: BulkImportModel = new BulkImportModel();
  progressBar: boolean = false;
  showPopupMessage: boolean = false;
  importedUserCount: string = '';
  importUsersData: ImportUser[] = [];
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loader: boolean = false;
  areaList: AreaModel[] = [];
  correctImportData: ImportUser[] = [];
  incorrectImportData: ImportUser[] = [];
  duplicateImports: ImportUser[] = [];
  dataSource: MatTableDataSource<ImportUser> = new MatTableDataSource();
  displayedColumns: string[] = ['checkbox'];
  selection = new SelectionModel<ImportUser>(true, []);
  selectedIndexList: number[] = [];
  selectedObjectList: ImportUser[] = [];
  successfulImports: ImportUser[] = [];
  disableButton: boolean = false;
  currentDateTime: Date = new Date();

  importUsersForm: FormGroup = this.formBuilder.group({
    importFile: ['', [Validators.required]],
    driveId: [, [Validators.required]],
    physical: [false],
    skipDuplicate: [false],
  });

  constructor(
    public dialogRef: MatDialogRef<ImportUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private candidateService: CandidateService,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private importXlxsFile: ImportXlxsFile,
  ) {
    this.driveList = data?.driveList;
    this.areaList = data?.areaOfInterestList;
  }

  ngOnInit() {}

  onSelectFile(list: FileList | null) {
    if (list && list.length > 0) {
      this.importFile = list[0];
      let file_name: string = this.importFile.name;
      this.importUsersForm.controls['importFile'].patchValue(file_name);
      let extension = file_name.substring(file_name.lastIndexOf('.') + 1);
      if (extension !== 'xlsx') {
        this.importUsersForm.controls['importFile'].setErrors({ invalidType: true });
      } else {
        this.importUsersForm.controls['importFile'].setErrors(null);
      }
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.importUsersForm.controls[controlName].hasError(errorName);
  };

  importUsers() {
    if (this.importUsersForm.valid) {
      this.disableButton = true;
      this.importObject.driveId = this.importUsersForm.controls['driveId'].value;
      this.importObject.physicalDrive = this.importUsersForm.controls['physical'].value;
      this.importObject.skipDuplicate = this.importUsersForm.controls['skipDuplicate'].value;

      this.loader = true;
      this.importXlxsFile.importXLXSFile(this.importFile).then((res: string[][]) => {
        this.loader = false;
        this.disableButton = false;
        let isInvalidFile: boolean = false;
        let headerNames: string[] = [];
        try {
          const requiredColumns = columnForImportUserOptions.map((column) => column.toLowerCase());
          headerNames = res[0].map((headerName: string) =>
            headerName?.toString().trim().toLowerCase(),
          );

          if (
            headerNames.length !== requiredColumns.length ||
            JSON.stringify(requiredColumns) !== JSON.stringify(headerNames)
          ) {
            this.toastr.error('Invalid file detected, Please upload a valid file');
            return;
          }
        } catch (e) {
          isInvalidFile = true;
        }

        if (!isInvalidFile) {
          const indexOfFirstName = headerNames.indexOf('firstname');
          const indexOfLastName = headerNames.indexOf('lastname');
          const indexOfMobileNumber = headerNames.indexOf('mobilenumber');
          const indexOfEmail = headerNames.indexOf('email');
          const indexOfAreaOfInterest = headerNames.indexOf('areaofinterest');
          const indexOfExamDate = headerNames.indexOf('examdate');
          const indexOfExamTime = headerNames.indexOf('examtime');

          res.splice(0, 1);

          res = res.filter((result) => result.length > 0);
          let wrongCells: { [key: number]: string[] } = {};
          this.candidateService.getCurrentDateTime().subscribe(
            (response: APIResponseObject) => {
              if (response.result) {
                this.currentDateTime = new Date(new Date(response.data).setHours(0, 0, 0, 0));
              }
            },
            (err: any) => {
              LoggerService.log('Error in get current time :::: ', err);
            },
          );

          res.forEach((data: any[], i: number) => {
            let isCorrectRow = false;
            let correctData = true;
            wrongCells[i + 2] = [];
            const importUserModel: ImportUser = new ImportUser();

            importUserModel.firstName = data[indexOfFirstName]?.trim();
            isCorrectRow =
              /^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/?.test(data?.[indexOfFirstName]?.trim()) ?? false;
            !isCorrectRow ? (wrongCells[i + 2] = ['firstName']) : '';

            importUserModel.lastName = data[indexOfLastName]?.trim();
            correctData =
              /^[\s]*[A-Za-z]+( [A-Za-z]+)*[\s]*$/?.test(data?.[indexOfLastName]?.trim()) ?? false;
            !correctData
              ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'lastName'])
              : (isCorrectRow = isCorrectRow && correctData);

            importUserModel.email = data[indexOfEmail]?.trim();
            correctData =
              /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}/?.test(data?.[indexOfEmail]?.trim()) ?? false;
            !correctData
              ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'email'])
              : (isCorrectRow = isCorrectRow && correctData);

            importUserModel.areaOfInterest = data[indexOfAreaOfInterest]?.trim();
            correctData =
              this.areaList.filter((area) => area.name == data[indexOfAreaOfInterest]?.trim())
                .length > 0;
            !correctData
              ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'areaOfInterest'])
              : (isCorrectRow = isCorrectRow && correctData);

            importUserModel.index = i + 2;
            importUserModel.mobileNumber = data[indexOfMobileNumber];
            correctData = /^[0-9]{10}$/?.test(data?.[indexOfMobileNumber].toString()) ?? false;
            !correctData
              ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'mobileNumber'])
              : (isCorrectRow = isCorrectRow && correctData);

            if (typeof data[indexOfExamDate] === 'number') {
              const date = excelDateToJSDate(data[indexOfExamDate]);
              correctData = new Date(new Date(this.currentDateTime).setHours(0, 0, 0, 0)) <= date;
              !correctData
                ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'examDate'])
                : (isCorrectRow = isCorrectRow && correctData);
              importUserModel.examDate = date.toLocaleDateString('en-US');
            } else {
              correctData = !isNaN(Date.parse(data[indexOfExamDate]));
              if (correctData) {
                correctData =
                  new Date(new Date(this.currentDateTime).setHours(0, 0, 0, 0)) <=
                  new Date(data[indexOfExamDate]);
                !correctData
                  ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'examDate'])
                  : (isCorrectRow = isCorrectRow && correctData);
              } else
                !correctData
                  ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'examDate'])
                  : (isCorrectRow = isCorrectRow && correctData);
              importUserModel.examDate = data[indexOfExamDate];
            }

            const examTime =
              typeof data[indexOfExamTime] === 'number'
                ? excelTimeToJSTime(data[indexOfExamTime]).toISOString().slice(11, 19)
                : data[indexOfExamTime];
            correctData =
              this.currentDateTime <= new Date(importUserModel.examDate + ' ' + examTime);
            !correctData
              ? (wrongCells[i + 2] = [...wrongCells[i + 2], 'examTime'])
              : (isCorrectRow = isCorrectRow && correctData);

            importUserModel.examTime = examTime;
            this.importUsersData.push(importUserModel);
            !wrongCells[i + 2]?.length
              ? this.correctImportData.push(importUserModel)
              : this.incorrectImportData.push(importUserModel);
          });
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = false;
          (dialogConfig.width = 'calc(100% - 40px)'),
            (dialogConfig.maxWidth = '100%'),
            (dialogConfig.maxHeight = 'calc(100% - 30px)');

          dialogConfig.data = {
            headerName: 'Preview Of Import Users',
            importUsers: this.importUsersData,
            columnList: columnForImportUserOptions,
            incorrectData: this.incorrectImportData,
            correctData: this.correctImportData,
            wrongDetailsCell: wrongCells,
          };

          const dialogRef = this.dialog.open(ImportUsersPreviewDialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe((data) => {
            this.importUsersData = [];
            this.incorrectImportData = [];
            this.correctImportData = [];
            if (data) {
              const formData = new FormData();
              formData.append('importFile', data?.importFile, 'importFile.xlsx');
              formData.append('importBean', JSON.stringify(this.importObject));
              this.loader = true;
              this.candidateService.importUsers(formData).subscribe(
                (response: APIResponseObject) => {
                  var total = response.data.length;
                  this.successfulImports = response.data?.filter(
                    (user: ImportUser) => user.status == 'Done',
                  );
                  const successCount = this.successfulImports.length;
                  this.importedUserCount = successCount + ' ' + (total - successCount);
                  this.duplicateImports = this.importObject.skipDuplicate
                    ? []
                    : response.data?.filter((user: ImportUser) =>
                        [
                          'Mobile Number already exists',
                          'Email already exists',
                          'Email already exists,Mobile Number already exists',
                        ].includes(user.status),
                      );
                  if (response.result) {
                    this.showPopupMessage = true;
                    this.excelService.exportAsExcelFile(this.successfulImports, 'reportSheet.xlsx');
                    this.sendRegsitrationEmail();
                    this.loader = false;
                  } else {
                    this.loader = false;
                    this.showPopupMessage = true;
                    this.toastr.error(response.message);
                  }
                  if (this.duplicateImports.length > 0) {
                    successCount > 0 ? this.toastr.error('Users Already Exist') : '';
                    this.displayedColumns.push(...columnForImportUserOptions);
                    this.dataSource = new MatTableDataSource(this.duplicateImports);
                  }
                },
                (error: any) => {
                  this.loader = false;
                  LoggerService.log('error==>', error);
                },
              );
            }
          });
        } else {
          this.toastr.error('Invalid file detected, Please upload a valid file.');
        }
      });
    } else {
      this.importUsersForm.markAllAsTouched();
      this.toastr.error('Please fill all the details correctly.');
    }
  }

  onChangeDrive(event: MatSelectChange) {
    this.loader = true;
    this.candidateService
      .getAreaOfInterestByDriveId([event.value])
      .subscribe((response: APIResponseObject) => {
        this.loader = false;
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
      });
  }
  sendRegsitrationEmail() {
    this.candidateService.sendRegistrationMail().subscribe((response: APIResponseObject) => {
      if (response.result) {
        this.toastr.success(response.message, '', { positionClass: 'toast-bottom-right' });
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedIndexList = [];
    } else {
      this.dataSource.data.forEach((row: ImportUser) => this.selection.select(row));
      this.selectedIndexList = this.dataSource.data.map((row: ImportUser, index: number) => index);
    }
  }

  addOrRemoveFromCheckedList(event: MatCheckboxChange, index: number) {
    this.dataSource.data.forEach((user: ImportUser, i: number) => {
      if (index == i) {
        if (event.checked) {
          this.selection.select(user);
          this.selectedIndexList.push(i);
        } else {
          this.selectedIndexList = this.selectedIndexList.filter((value: number) => value != index);
          this.selection.deselect(user);
        }
      }
    });
  }
  importDuplicateUsers() {
    var selectedUsers: ImportUser[] = this.dataSource.data.filter(
      (user: ImportUser, index: number) => this.selectedIndexList.includes(index),
    );
    var usersData = selectedUsers.map((user: any) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      areaOfInterest: user.areaOfinterest,
      examDate:
        typeof user.examDate === 'string'
          ? new Date(user.examDate).toISOString().slice(0, 10)
          : user.examDate,
      examTime:
        typeof user.examTime === 'string'
          ? new Date(
              new Date(0).toLocaleDateString('en-US') + ' ' + user.examTime,
            ).toLocaleTimeString('en-US')
          : user.examTime,
    }));
    const file = this.prepareWorkBook(usersData);
    this.importObject.skipDuplicate = true;
    const formData = new FormData();
    formData.append('importFile', file, 'importFile.xlsx');
    formData.append('importBean', JSON.stringify(this.importObject));
    this.loader = true;
    this.candidateService.importUsers(formData).subscribe(
      (response: APIResponseObject) => {
        var total = response.data.length;
        this.loader = false;
        this.successfulImports = response.data?.filter((user: any) => user?.status == 'Done');
        const successCount = this.successfulImports.length;
        this.importedUserCount = successCount + ' ' + (total - successCount);
        this.duplicateImports = [];
        this.showPopupMessage = true;
        this.loader = true;
        this.excelService.exportAsExcelFile(this.successfulImports, 'reportSheet.xlsx');
        this.sendRegsitrationEmail();
        this.dataSource = new MatTableDataSource(
          this.dataSource.data.filter(
            (user: ImportUser, index: number) => !selectedUsers.includes(user),
          ),
        );
        this.loader = false;
      },
      (err: any) => {
        this.loader = false;
        LoggerService.log('Error :::: ', err);
      },
    );
  }
  prepareWorkBook(usersObject: any) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usersObject, {
      header: this.data?.columnList,
    });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'importFile');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    var blob = new Blob([this.s2ab(atob(excelBuffer))], { type: 'application/octet-stream' });
    return blob;
  }
  s2ab(s: any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
}
