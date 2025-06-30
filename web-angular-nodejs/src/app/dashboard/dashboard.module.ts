import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ExamineeDashboardComponent } from './components/examinee-dashboard/examinee-dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { CoreModule } from '../core/core.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaterialModule } from '../material.module';
import { ExamineeDashboardDescriptionComponent } from './components/examinee-dashboard-description/examinee-dashboard-description.component';
import { ExamineeCompletedDashboardComponent } from './components/examinee-completed-dashboard/examinee-completed-dashboard.component';
import { UpdateExamineeResultDialogComponent } from './dialogs/update-examinee-result-dialog/update-examinee-result-dialog.component';

@NgModule({
  declarations: [
    ExamineeDashboardComponent,
    ExamineeDashboardDescriptionComponent,
    ExamineeCompletedDashboardComponent,
    UpdateExamineeResultDialogComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, CoreModule, InfiniteScrollModule, MaterialModule],
  providers: [DashboardService],
})
export class DashboardModule {}
