/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenditureCategoryRoutingModule } from "./expenditure-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ExpenditureCategoryComponent } from "./expenditure-category.component";
import { ExpenditureCategoryUpdateComponent } from "./update/expenditure-category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ExpenditureCategoryRoutingModule],
  declarations: [
    ExpenditureCategoryComponent,
    ExpenditureCategoryUpdateComponent,
  ],
  entryComponents: [ExpenditureCategoryUpdateComponent],
})
export class ExpenditureCategoryModule {}
