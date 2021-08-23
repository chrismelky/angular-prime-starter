/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryOptionRoutingModule } from "./category-option-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CategoryOptionComponent } from "./category-option.component";
import { CategoryOptionUpdateComponent } from "./update/category-option-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CategoryOptionRoutingModule],
  declarations: [CategoryOptionComponent, CategoryOptionUpdateComponent],
  entryComponents: [CategoryOptionUpdateComponent],
})
export class CategoryOptionModule {}
