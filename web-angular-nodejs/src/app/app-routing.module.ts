import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorCode } from './core/enums/ErrorCode';
import { PageRoutes, QueryParamNames } from './core/utils/constants';
import { ErrorComponent } from './errors/components/error/error.component';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';
import { apiGuard } from './guard/api.guard';

const routes: Routes = [
  {
    path: PageRoutes.AuthPage,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [apiGuard],
  },
  {
    path: PageRoutes.PowerUserPage,
    loadChildren: () => import('./power-user/power-user.module').then((m) => m.PowerUserModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.DriveSetupPage,
    loadChildren: () => import('./drive-setup/drive-setup.module').then((m) => m.DriveSetupModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.AddDrivePage,
    loadChildren: () => import('./add-drive/add-drive.module').then((m) => m.AddDriveModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.DashboardPage,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.PaperSetupPage,
    loadChildren: () => import('./paper-setup/paper-setup.module').then((m) => m.PaperSetupModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.CandidatePage,
    loadChildren: () => import('./candidate/candidate.module').then((m) => m.CandidateModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.ExamineeMarksPage,
    loadChildren: () =>
      import('./examinee-marks/examinee-marks.module').then((m) => m.ExamineeMarksModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.InactiveCandidatePage,
    loadChildren: () =>
      import('./inactive-candidate/inactive-candidate.module').then(
        (m) => m.InactiveCandidateModule,
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.RefferalPage,
    loadChildren: () => import('./referral/referral.module').then((m) => m.ReferralModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.ObjectivePaperPage,
    loadChildren: () =>
      import('./objective-paper/objective-paper.module').then((m) => m.ObjectivePaperModule),
  },
  {
    path: PageRoutes.SubjectivePaperPage,
    loadChildren: () =>
      import('./subjective-paper/subjective-paper.module').then((m) => m.SubjectivePaperModule),
  },
  {
    path: PageRoutes.QuestionTypePage,
    loadChildren: () =>
      import('./question-type/question-type.module').then((m) => m.QuestionTypeModule),
  },
  {
    path: PageRoutes.UserActivityPage,
    loadChildren: () =>
      import('./invigilation/invigilation.module').then((m) => m.InvigilationModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.ThankyouPage,
    loadChildren: () => import('./thank-you/thank-you.module').then((m) => m.ThankYouModule),
  },
  {
    path: PageRoutes.EmailTemplates,
    loadChildren: () =>
      import('./email-templates/email-templates.module').then((m) => m.EmailTemplatesModule),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: PageRoutes.ErrorPage,
    children: [
      {
        path: `:${QueryParamNames.Type}`,
        pathMatch: 'full',
        component: ErrorComponent,
      },
    ],
  },
  {
    path: 'interviewers',
    loadChildren: () => import('./interviewer/interviewer.module').then((m) => m.InterviewerModule),
    canActivate: [authGuard, roleGuard],
    data: {
      role: ['SuperAdmin', 'Admin', 'Invigilator'],
    },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: `${PageRoutes.ErrorPage}/${ErrorCode.NOT_FOUND}`,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
