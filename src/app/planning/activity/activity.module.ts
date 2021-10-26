/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityRoutingModule } from './activity-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { ActivityComponent } from './activity.component';
import { ActivityUpdateComponent } from './update/activity-update.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ResponsiblePersonSharedModule } from '../responsible-person/responsible-person-shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ActivityRoutingModule,
    MatStepperModule,
    ResponsiblePersonSharedModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  declarations: [ActivityComponent, ActivityUpdateComponent],
  entryComponents: [ActivityUpdateComponent],
})
export class ActivityModule {}
