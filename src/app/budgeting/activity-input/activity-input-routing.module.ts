/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AdminHierarchyCostCentreResolveService,
  PlanningFinancialYearResolveService,
} from 'src/app/planning/activity/activity-routing.module';
import { ActivityInputComponent } from './activity-input.component';

const routes: Routes = [
  {
    path: ':budgetType/:adminHierarchyCostCentreId',
    component: ActivityInputComponent,
    data: {
      defaultSort: 'id:asc',
    },
    resolve: {
      adminHierarchyCostCentre: AdminHierarchyCostCentreResolveService,
      financialYear: PlanningFinancialYearResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityInputRoutingModule {}