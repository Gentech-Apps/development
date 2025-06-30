import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection, QuillModule } from 'ngx-quill';
import { QuillConfiguration } from '../../utils/constants';
import { isOnlyWhitespaceExcludingHtmlTags } from '../../utils/commonFunction';

@Component({
  selector: 'app-add-email-template-dialog',
  templateUrl: './add-email-template-dialog.component.html',
  styleUrls: ['./add-email-template-dialog.component.scss'],
})
export class AddEmailTemplateDialogComponent implements OnInit {
  id: number | undefined;
  option: string = '';
  templateType: string = '';
  htmlContent = '';
  isValid: boolean = true;
  toolbarConfig: QuillModule = QuillConfiguration;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddEmailTemplateDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.id = this.data.obj.id;
    this.option = this.data.option;
    this.templateType = this.data.name;
    this.htmlContent = this.data.obj.content;
  }

  isValidEditorValue() {
    this.isValid =
      this.htmlContent != null ? !isOnlyWhitespaceExcludingHtmlTags(this.htmlContent) : false;
    return this.isValid;
  }

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    if ($event.event === 'text-change') {
      this.isValid = $event.text.trim().length > 0;
      this.isValidEditorValue();
    }
  }

  closeDialog() {
    if (this.isValid && this.htmlContent != null) {
      this.dialogRef.close({ id: this.id, content: this.htmlContent });
    } else {
      this.isValidEditorValue();
    }
  }
}
