/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DataValueComponent } from './data-value.component';
import { ImportComponent } from './import/import.component';

const routes: Routes = [
  {
    path: '',
    component: DataValueComponent,
    data: {
      defaultSort: 'id:asc',
    },
  },
  {
    path: 'import',
    component: ImportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'IMPORT_DATA_VALUES',
        redirectTo: '/dashboard',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataValueRoutingModule {}
