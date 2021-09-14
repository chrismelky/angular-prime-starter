/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategicPlanComponent } from './strategic-plan.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StrategicPlanComponent,
    data: {
      defaultSort: 'id:asc',
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/long-term-target',
    loadChildren: () =>
      import('../../setup/long-term-target/long-term-target.module').then(
        (m) => m.LongTermTargetModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrategicPlanRoutingModule {}
