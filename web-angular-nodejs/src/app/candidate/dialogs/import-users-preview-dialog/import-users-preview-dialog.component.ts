import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ImportUser } from '../../models/import-user.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as XLSX from 'xlsx';
import { LoggerService } from 'src/app/core/services/logger.service';
import * as moment from 'moment';

@Component({
  selector: 'app-import-users-preview-dialog',
  templateUrl: './import-users-preview-dialog.component.html',
  styleUrls: ['./import-users-preview-dialog.component.scss'],
})
export class ImportUsersPreviewDialogComponent {
  selectedObjectList: ImportUser[] = [];
  correctDataSource: any;
  incorrectDataSource: any;
  displayedColumns: string[] = ['checkbox', 'serialNo'];
  headerName: string = '';
  selectedIndexList: number[] = [];
  driveId: number = 0;
  physicalDrive: boolean = false;
  skipDuplicate: boolean = false;
  incorrectDataIndex: number[] = [];
  showIncorrect: boolean = false;
  selection = new SelectionModel<ImportUser>(true, []);
  wrongCellsData: any;
  file: any;

  constructor(
    private dialogRef: MatDialogRef<ImportUsersPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.headerName = data?.headerName;
    this.displayedColumns.push(...data?.columnList);
    this.selectedObjectList = data?.importUsers;
    this.wrongCellsData = data?.wrongDetailsCell;
  }

  ngOnInit() {
    this.prepareCorrectUsersTableData();
    this.prepareIncorrectUsersTable();
    this.incorrectDataIndex = this.incorrectDataSource?.data?.map((user: ImportUser) => user.index);
  }

  prepareCorrectUsersTableData() {
    this.correctDataSource = new MatTableDataSource(this.data?.correctData);
  }

  prepareIncorrectUsersTable() {
    this.incorrectDataSource = new MatTableDataSource(this.data?.incorrectData);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.correctDataSource.data.length;
    return numSelected === numRows;
  }

  selectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedIndexList = [];
    } else {
      this.correctDataSource.data.forEach((row: ImportUser) => this.selection.select(row));
      this.selectedIndexList = this.selectedObjectList?.map((user: ImportUser) => user.index);
    }
  }

  addOrRemoveFromCheckedList(event: MatCheckboxChange, index: number) {
    this.correctDataSource.data.forEach((user: ImportUser) => {
      if (user.index == index) {
        if (event.checked) {
          this.selection.select(user);
          this.selectedIndexList.push(index);
        } else {
          this.selectedIndexList = this.selectedIndexList.filter((value: number) => value != index);
          this.selection.deselect(user);
        }
      }
    });
  }

  checkData(element: ImportUser, column: string) {
    var isIncorrectRow = this.incorrectDataIndex.includes(element.index);
    if (isIncorrectRow && this.wrongCellsData[element.index].includes(column)) {
      return true;
    }
    return false;
  }

  importUsers() {
    const selectedUsers: ImportUser[] = this.correctDataSource.data.filter((user: ImportUser) =>
      this.selectedIndexList.includes(user.index),
    );
    const usersData = selectedUsers.map((user: ImportUser) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      areaOfInterest: user.areaOfInterest,
      examDate:
        typeof user.examDate === 'string'
          ? moment(user.examDate).format('YYYY-MM-DD').toString()
          : user.examDate,
      examTime:
        typeof user.examTime === 'string'
          ? new Date(
              new Date(0).toLocaleDateString('en-US') + ' ' + user.examTime,
            ).toLocaleTimeString('en-US')
          : user.examTime,
    }));
    const file = this.prepareWorkBook(usersData);
    const data = { importFile: file };
    this.dialogRef.close(data);
  }
  closeDialog() {
    this.selectedObjectList = [];
    this.correctDataSource.data = [];
    this.incorrectDataSource.data = [];
    this.selection.clear();
    this.dialogRef.close();
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
