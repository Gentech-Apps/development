import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { DuplicateExamineeListComponent } from './duplicate-examinee-list/duplicate-examinee-list.component';

const routes: Routes = [
  { path: '', component: CandidateListComponent },
  { path: 'duplicate-user-list', component: DuplicateExamineeListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateRoutingModule {}
