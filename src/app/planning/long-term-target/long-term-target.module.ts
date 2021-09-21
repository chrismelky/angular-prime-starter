/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongTermTargetRoutingModule } from './long-term-target-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { LongTermTargetComponent } from './long-term-target.component';
import { LongTermTargetUpdateComponent } from './update/long-term-target-update.component';
import { FinancialYearTargetViewComponent } from './financial-year-target-view/financial-year-target-view.component';
import { TargetPerformanceIndicatorModule } from '../target-performance-indicator/target-performance-indicator.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LongTermTargetRoutingModule,
    TargetPerformanceIndicatorModule,
  ],
  declarations: [
    LongTermTargetComponent,
    LongTermTargetUpdateComponent,
    FinancialYearTargetViewComponent,
  ],
  entryComponents: [LongTermTargetUpdateComponent],
})
export class LongTermTargetModule {}
