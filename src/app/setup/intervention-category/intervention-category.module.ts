/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InterventionCategoryRoutingModule } from "./intervention-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { InterventionCategoryComponent } from "./intervention-category.component";
import { InterventionCategoryUpdateComponent } from "./update/intervention-category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, InterventionCategoryRoutingModule],
  declarations: [
    InterventionCategoryComponent,
    InterventionCategoryUpdateComponent,
  ],
  entryComponents: [InterventionCategoryUpdateComponent],
})
export class InterventionCategoryModule {}
