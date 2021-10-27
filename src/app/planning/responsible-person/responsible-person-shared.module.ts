/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsiblePersonUpdateComponent } from './update/responsible-person-update.component';
import { SharedPrimengModule } from 'src/app/shared/shared-primeng.module';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';

@NgModule({
  imports: [SharedPrimengModule, SharedMaterialModule, CommonModule],
  declarations: [ResponsiblePersonUpdateComponent],
  entryComponents: [ResponsiblePersonUpdateComponent],
  exports: [ResponsiblePersonUpdateComponent],
})
export class ResponsiblePersonSharedModule {}
