import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamineeDashboardComponent } from './components/examinee-dashboard/examinee-dashboard.component';
import { ExamineeDashboardDescriptionComponent } from './components/examinee-dashboard-description/examinee-dashboard-description.component';
import { ExamineeCompletedDashboardComponent } from './components/examinee-completed-dashboard/examinee-completed-dashboard.component';

const routes: Routes = [
  { path: '', component: ExamineeDashboardComponent },
  { path: 'examinee-deatil-description', component: ExamineeDashboardDescriptionComponent },
  { path: 'completed-examinee-description', component: ExamineeCompletedDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
