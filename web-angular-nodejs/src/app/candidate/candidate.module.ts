import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CandidateService } from './services/candidate.service';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { ImportUsersDialogComponent } from './dialogs/import-users-dialog/import-users-dialog.component';
import { ExcelService } from './services/export-to-excel.service';
import { DuplicateExamineeListComponent } from './duplicate-examinee-list/duplicate-examinee-list.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ImportUsersPreviewDialogComponent } from './dialogs/import-users-preview-dialog/import-users-preview-dialog.component';

@NgModule({
  declarations: [
    CandidateListComponent,
    AddUserDialogComponent,
    ImportUsersDialogComponent,
    DuplicateExamineeListComponent,
    ImportUsersPreviewDialogComponent,
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    CoreModule,
    MaterialModule,
    InfiniteScrollModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
  ],
  providers: [CandidateService, ExcelService],
})
export class CandidateModule {}
