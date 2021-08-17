import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'facility-type',
        loadChildren: () =>
          import('../setup/facility-type/facility-type.module').then(
            (m) => m.FacilityTypeModule
          ),
      },
      {
        path: 'facility',
        loadChildren: () =>
          import('../setup/facility/facility.module').then(
            (m) => m.FacilityModule
          ),
      },
      /**====Planrep router Generator Hook: Dont Delete====*/
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
