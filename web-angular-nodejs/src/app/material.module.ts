import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';

const modules: any = [
  MatTooltipModule,
  MatTableModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRippleModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatListModule,
  MatSnackBarModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  MatCheckboxModule,
  MatSortModule,
  MatExpansionModule,
  ReactiveFormsModule,
  FormsModule,
  MatTreeModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatChipsModule,
  MatSliderModule,
  TimepickerModule,
  MatAutocompleteModule,
  MatMenuModule,
  // Declare material modules here only
  // we have to use material modules in every module
];
@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
