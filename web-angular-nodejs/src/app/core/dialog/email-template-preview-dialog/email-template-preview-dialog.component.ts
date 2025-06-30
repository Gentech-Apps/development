import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email-template-preview-dialog',
  templateUrl: './email-template-preview-dialog.component.html',
  styleUrls: ['./email-template-preview-dialog.component.scss'],
})
export class EmailTemplatePreviewDialogComponent {
  html: string = '';
  emailSubject: string = '';
  templateName: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EmailTemplatePreviewDialogComponent>,
  ) {
    this.html = data.obj.html;
    this.emailSubject = data.subject;
    this.templateName = data.name;
  }

  ngOnInit() {}
}
