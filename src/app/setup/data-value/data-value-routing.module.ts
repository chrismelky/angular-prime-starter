/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataValueComponent } from './data-value.component';

const routes: Routes = [
  {
    path: '',
    component: DataValueComponent,
    data: {
      defaultSort: 'id:asc',
    },
    children: [
      {
        path: ':id',
        component: DataValueComponent,
        // outlet: 'dataValue',
        data: {
          defaultSort: 'id:asc',
        },
        //canActivate: [UserRouteAccessService],
      },
    ],
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataValueRoutingModule {}
