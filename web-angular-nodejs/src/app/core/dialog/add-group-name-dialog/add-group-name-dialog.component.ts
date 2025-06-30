import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-add-group-name-dialog',
  templateUrl: './add-group-name-dialog.component.html',
  styleUrls: ['./add-group-name-dialog.component.scss'],
})
export class AddGroupNameDialogComponent {
  groupName: string = '';
  groupNameRequired: boolean = false;
  headerMessage: string = '';
  titleMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddGroupNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.headerMessage = data.headerMessage;
    this.titleMessage = data.titleMessage;
    this.titleMessage == 'Subject'
      ? (this.groupName = data.previousSubject)
      : (this.groupName = '');
  }

  validateSubjectField() {
    this.groupNameRequired = this.groupName.trim() == '' ? true : false;
  }

  onAdd() {
    this.groupName.trim() == ''
      ? (this.groupNameRequired = true)
      : this.dialogRef.close(this.groupName.trim());
  }
}
