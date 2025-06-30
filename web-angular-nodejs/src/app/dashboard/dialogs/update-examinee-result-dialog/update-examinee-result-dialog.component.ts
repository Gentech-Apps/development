import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-update-examinee-result-dialog',
  templateUrl: './update-examinee-result-dialog.component.html',
  styleUrls: ['./update-examinee-result-dialog.component.scss'],
})
export class UpdateExamineeResultDialogComponent {
  header: string = '';
  updateResultForm: FormGroup = this.formBuilder.group({
    subjectiveResult: [{ value: '', disabled: true }],
    objectiveResult: [{ value: '', disabled: true }],
    finalResult: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UpdateExamineeResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.header = data?.header;
    this.updateResultForm.controls['subjectiveResult'].setValue(data?.subjectiveResult);
    this.updateResultForm.controls['objectiveResult'].setValue(data?.objectiveResult);
    LoggerService.log('updateResultForm', data?.objectiveResult);
  }

  onSubmit() {
    this.dialogRef.close(this.updateResultForm.controls['finalResult'].value);
  }
}
