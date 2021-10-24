/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiblePersonRoutingModule } from './responsible-person-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { ResponsiblePersonComponent } from './responsible-person.component';
import { ResponsiblePersonSharedModule } from './responsible-person-shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ResponsiblePersonRoutingModule,
    ResponsiblePersonSharedModule,
  ],
  declarations: [ResponsiblePersonComponent],
  entryComponents: [],
})
export class ResponsiblePersonModule {}
