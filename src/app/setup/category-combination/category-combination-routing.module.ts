/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryCombinationComponent } from './category-combination.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryCombinationComponent,
    data: {
      defaultSort: 'sort_order:asc',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryCombinationRoutingModule {}
