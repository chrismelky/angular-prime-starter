/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryOptionCombinationComponent } from './category-option-combination.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryOptionCombinationComponent,
    data: {
      defaultSort: 'sort_order:asc',
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryOptionCombinationRoutingModule {}
