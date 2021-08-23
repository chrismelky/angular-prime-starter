/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryCombinationRoutingModule } from "./category-combination-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CategoryCombinationComponent } from "./category-combination.component";
import { CategoryCombinationUpdateComponent } from "./update/category-combination-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CategoryCombinationRoutingModule],
  declarations: [
    CategoryCombinationComponent,
    CategoryCombinationUpdateComponent,
  ],
  entryComponents: [CategoryCombinationUpdateComponent],
})
export class CategoryCombinationModule {}
