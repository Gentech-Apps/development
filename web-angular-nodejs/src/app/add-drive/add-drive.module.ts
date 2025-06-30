import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDriveRoutingModule } from './add-drive-routing.module';
import { AddDriveComponent } from './components/add-drive/add-drive.component';
import { CoreModule } from '../core/core.module';
import { DrivePreviewDialogComponent } from './dialog/drive-preview-dialog/drive-preview-dialog.component';
import { AddDriveService } from './services/addDrive.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { InterviewerService } from '../interviewer/services/interviewer.service';

@NgModule({
  declarations: [DrivePreviewDialogComponent, AddDriveComponent],
  imports: [
    CommonModule,
    AddDriveRoutingModule,
    CommonModule,
    CoreModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
  ],
  providers: [AddDriveService, InterviewerService],
})
export class AddDriveModule {}
