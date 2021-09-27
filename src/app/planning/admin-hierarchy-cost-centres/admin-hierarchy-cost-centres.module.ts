/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHierarchyCostCentresRoutingModule } from './admin-hierarchy-cost-centres-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { AdminHierarchyCostCentresComponent } from './admin-hierarchy-cost-centres.component';

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyCostCentresRoutingModule],
  declarations: [AdminHierarchyCostCentresComponent],
  entryComponents: [],
})
export class AdminHierarchyCostCentresModule {}
