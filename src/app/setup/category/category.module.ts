/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryRoutingModule } from "./category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CategoryComponent } from "./category.component";
import { CategoryUpdateComponent } from "./update/category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CategoryRoutingModule],
  declarations: [CategoryComponent, CategoryUpdateComponent],
  entryComponents: [CategoryUpdateComponent],
})
export class CategoryModule {}
