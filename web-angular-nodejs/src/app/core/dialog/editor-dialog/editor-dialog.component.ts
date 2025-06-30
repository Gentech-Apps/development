import { Component, HostListener, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection, QuillModule } from 'ngx-quill';
import { QuillConfiguration } from '../../utils/constants';
import { editorDialogInterface } from '../../interface/editorDialog';
import { FormControlVariables } from '../../constants.ts/form-control-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PREVENT_ONLY_WHITESPACES_REGEX } from '../../constants.ts/regex-constants';
import { isOnlyWhitespaceExcludingHtmlTags } from '../../utils/commonFunction';
import { LOADER_COLOR, LOADER_MODE } from '../../constants.ts/loader-constant';

@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss'],
})
export class EditorDialogComponent {
  htmlContent: string = '';
  isValid: boolean = false;
  toolbarConfig: QuillModule = QuillConfiguration;
  private formBuilder: FormBuilder = inject(FormBuilder);
  formControlVariables: FormControlVariables = inject(FormControlVariables);
  showConfirmationMessage: boolean = false;
  showLoader: boolean = false;
  color = LOADER_COLOR;
  mode = LOADER_MODE;
  isFinalOffer: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editorDialogInterface,
  ) {}

  feedbackFormGroup: FormGroup = this.formBuilder.group({
    [this.formControlVariables.feedback]: [
      '',
      [Validators.required, Validators.pattern(PREVENT_ONLY_WHITESPACES_REGEX)],
    ],
  });

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    if ($event.event === 'text-change') {
      const isValid = $event.text.trim().length > 0;
      this.updateEditorValidity(isValid);
    }
  }

  updateEditorValidity(isValidValue: boolean) {
    if (isValidValue) {
      this.feedbackFormGroup.controls[this.formControlVariables.feedback].removeValidators([
        Validators.required,
      ]);
    } else {
      this.feedbackFormGroup.controls[this.formControlVariables.feedback].addValidators([
        Validators.required,
      ]);
      this.showConfirmationMessage = false;
    }
    this.feedbackFormGroup.controls[this.formControlVariables.feedback].updateValueAndValidity();
  }

  isValidEditorValue() {
    const editorValue = this.feedbackFormGroup.controls[this.formControlVariables.feedback].value;
    return !isOnlyWhitespaceExcludingHtmlTags(editorValue ?? '');
  }

  disableSubmitButton(): boolean {
    return !this.feedbackFormGroup.valid;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitFeedback(): void {
    if (!this.showConfirmationMessage) {
      this.showConfirmationMessage = true;
      return;
    }
    this.showLoader = true;
    this.dialogRef.close(this.htmlContent);
  }
}
