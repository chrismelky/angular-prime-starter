/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryCategoryCombinationRoutingModule } from "./category-category-combination-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CategoryCategoryCombinationComponent } from "./category-category-combination.component";
import { CategoryCategoryCombinationUpdateComponent } from "./update/category-category-combination-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CategoryCategoryCombinationRoutingModule,
  ],
  declarations: [
    CategoryCategoryCombinationComponent,
    CategoryCategoryCombinationUpdateComponent,
  ],
  entryComponents: [CategoryCategoryCombinationUpdateComponent],
})
export class CategoryCategoryCombinationModule {}
