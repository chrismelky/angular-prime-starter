/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryOptionCombinationRoutingModule } from './category-option-combination-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { CategoryOptionCombinationComponent } from './category-option-combination.component';
import { CategoryOptionCombinationUpdateComponent } from './update/category-option-combination-update.component';

@NgModule({
  imports: [SharedModule, CommonModule, CategoryOptionCombinationRoutingModule],
  declarations: [
    CategoryOptionCombinationComponent,
    CategoryOptionCombinationUpdateComponent,
  ],
  entryComponents: [CategoryOptionCombinationUpdateComponent],
})
export class CategoryOptionCombinationModule {}
