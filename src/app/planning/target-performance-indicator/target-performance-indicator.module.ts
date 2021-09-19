/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetPerformanceIndicatorRoutingModule } from './target-performance-indicator-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { TargetPerformanceIndicatorComponent } from './target-performance-indicator.component';
import { TargetPerformanceIndicatorUpdateComponent } from './update/target-performance-indicator-update.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    TargetPerformanceIndicatorRoutingModule,
  ],
  declarations: [
    TargetPerformanceIndicatorComponent,
    TargetPerformanceIndicatorUpdateComponent,
  ],
  exports: [TargetPerformanceIndicatorComponent],
  entryComponents: [TargetPerformanceIndicatorUpdateComponent],
})
export class TargetPerformanceIndicatorModule {}
