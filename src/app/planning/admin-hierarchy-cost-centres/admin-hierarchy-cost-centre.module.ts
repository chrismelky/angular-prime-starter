/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHierarchyCostCentreRoutingModule } from './admin-hierarchy-cost-centre-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { AdminHierarchyCostCentreComponent } from './admin-hierarchy-cost-centre.component';

@NgModule({
  imports: [SharedModule, CommonModule, AdminHierarchyCostCentreRoutingModule],
  declarations: [AdminHierarchyCostCentreComponent],
  entryComponents: [],
})
export class AdminHierarchyCostCentreModule {}
