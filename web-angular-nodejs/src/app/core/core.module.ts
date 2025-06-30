import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StorageBrowser } from './services/storage.service';
import { LoggerService } from './services/logger.service';
import { SwalService } from './services/swal.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { CountdownModule } from 'ngx-countdown';
import { FileSaverModule } from 'ngx-filesaver';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../material.module';
import { PreviewScreenMessageComponent } from './components/preview-screen-message/preview-screen-message.component';
import { AddEmailTemplateDialogComponent } from './dialog/add-email-template-dialog/add-email-template-dialog.component';
import { AddGroupNameDialogComponent } from './dialog/add-group-name-dialog/add-group-name-dialog.component';
import { EmailTemplatePreviewDialogComponent } from './dialog/email-template-preview-dialog/email-template-preview-dialog.component';
import { ImportDataDialogComponent } from './dialog/import-data-dialog/import-data-dialog.component';
import { PossibleDuplicateUsersDialogComponent } from './dialog/possible-duplicate-users-dialog/possible-duplicate-users-dialog.component';
import { PreviewImportFileComponent } from './dialog/preview-import-file/preview-import-file.component';
import { ViewProfileDialogComponent } from './dialog/view-profile-dialog/view-profile-dialog.component';
import { safeHtmlPipe } from './pipes/safeHtml.pipe';
import { SafeUrl } from './pipes/safeUrl.pipe';
import { ToTwelveHoursBase } from './pipes/totwelveHourBase';
import { ApiService } from './services/api.service';
import { checkIPService } from './services/checkIP.service';
import { PreventCtrlSDirective } from './directives/PreventCtrlSDirective';
import { MessageDialogComponent } from './dialog/message-dialog/message-dialog.component';
import { PreventContextMenuDirective } from './directives/prevent-context-menu.directive';
import { QuillModule } from 'ngx-quill';
import { EditorDialogComponent } from './dialog/editor-dialog/editor-dialog.component';

@NgModule({
  declarations: [
    PreviewScreenMessageComponent,
    AddEmailTemplateDialogComponent,
    AddGroupNameDialogComponent,
    EmailTemplatePreviewDialogComponent,
    safeHtmlPipe,
    SafeUrl,
    ToTwelveHoursBase,
    ImportDataDialogComponent,
    ViewProfileDialogComponent,
    PossibleDuplicateUsersDialogComponent,
    PreventCtrlSDirective,
    PreviewImportFileComponent,
    MessageDialogComponent,
    PreventContextMenuDirective,
    EditorDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right', timeOut: 5000 }),
    HttpClientModule,
    InfiniteScrollModule,
    MatDialogModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatStepperModule,
    MaterialModule,
    FileSaverModule,
    CountdownModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
    AsyncPipe,
    QuillModule.forRoot(),
  ],
  providers: [
    { provide: ToastrService, useClass: ToastrService },
    HttpClient,
    DatePipe,
    ApiService,
    StorageBrowser,
    HttpClientModule,
    HttpClient,
    LoggerService,
    SwalService,
    checkIPService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
  exports: [
    AddEmailTemplateDialogComponent,
    PreviewScreenMessageComponent,
    AddGroupNameDialogComponent,
    EmailTemplatePreviewDialogComponent,
    MaterialModule,
    ToTwelveHoursBase,
    ImportDataDialogComponent,
    safeHtmlPipe,
    SafeUrl,
    ViewProfileDialogComponent,
    PossibleDuplicateUsersDialogComponent,
    CountdownModule,
    PreviewImportFileComponent,
    AsyncPipe,
    PreventCtrlSDirective,
    PreventContextMenuDirective,
  ],
})
export class CoreModule {}
