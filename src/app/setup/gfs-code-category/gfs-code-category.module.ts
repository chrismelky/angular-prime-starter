/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GfsCodeCategoryRoutingModule } from "./gfs-code-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GfsCodeCategoryComponent } from "./gfs-code-category.component";
import { GfsCodeCategoryUpdateComponent } from "./update/gfs-code-category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, GfsCodeCategoryRoutingModule],
  declarations: [GfsCodeCategoryComponent, GfsCodeCategoryUpdateComponent],
  entryComponents: [GfsCodeCategoryUpdateComponent],
})
export class GfsCodeCategoryModule {}
