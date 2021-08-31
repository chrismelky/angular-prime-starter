/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransportCategoryRoutingModule } from "./transport-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { TransportCategoryComponent } from "./transport-category.component";
import { TransportCategoryUpdateComponent } from "./update/transport-category-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, TransportCategoryRoutingModule],
  declarations: [TransportCategoryComponent, TransportCategoryUpdateComponent],
  entryComponents: [TransportCategoryUpdateComponent],
})
export class TransportCategoryModule {}
