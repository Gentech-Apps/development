import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDriveComponent } from './components/add-drive/add-drive.component';

const routes: Routes = [{ path: '', component: AddDriveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDriveRoutingModule {}
