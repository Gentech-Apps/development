import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-warning-message-dialog',
  templateUrl: './user-warning-message-dialog.component.html',
  styleUrls: ['./user-warning-message-dialog.component.scss'],
})
export class UserWarningMessageDialogComponent {
  submited: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserWarningMessageDialogComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }

  isCancel() {
    this.dialogRef.close(false);
  }

  isSubmited() {
    this.dialogRef.close(true);
  }
}
