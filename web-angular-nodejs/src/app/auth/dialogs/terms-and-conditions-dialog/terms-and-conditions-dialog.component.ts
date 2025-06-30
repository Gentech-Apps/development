import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-and-conditions-dialog',
  templateUrl: './terms-and-conditions-dialog.component.html',
  styleUrls: ['./terms-and-conditions-dialog.component.scss'],
})
export class TermsAndConditionsDialogComponent {
  constructor(public dialogRef: MatDialogRef<TermsAndConditionsDialogComponent>) {}

  conditionsList: string[] = [
    'Your data will be stored safely with us',
    'Your registration credentials will be a company property and can be changed/revoked.',
    'The information provided above is true to the best of your knowledge and the test is being given by you with a fully conscious mind.',
  ];

  ngOnInit() {}
}
