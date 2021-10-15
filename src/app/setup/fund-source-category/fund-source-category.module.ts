/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FundSourceCategoryRoutingModule } from "./fund-source-category-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FundSourceCategoryComponent } from "./fund-source-category.component";
import { FundSourceCategoryUpdateComponent } from "./update/fund-source-category-update.component";
import {UploadComponent} from "./upload/upload.component";

@NgModule({
  imports: [SharedModule, CommonModule, FundSourceCategoryRoutingModule],
  declarations: [
    FundSourceCategoryComponent,
    FundSourceCategoryUpdateComponent,UploadComponent
  ],
  entryComponents: [FundSourceCategoryUpdateComponent],
})
export class FundSourceCategoryModule {}
