/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryCategoryOptionRoutingModule } from "./category-category-option-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CategoryCategoryOptionComponent } from "./category-category-option.component";
import { CategoryCategoryOptionUpdateComponent } from "./update/category-category-option-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CategoryCategoryOptionRoutingModule],
  declarations: [
    CategoryCategoryOptionComponent,
    CategoryCategoryOptionUpdateComponent,
  ],
  entryComponents: [CategoryCategoryOptionUpdateComponent],
})
export class CategoryCategoryOptionModule {}
