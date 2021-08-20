/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetConditionRoutingModule } from "./asset-condition-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AssetConditionComponent } from "./asset-condition.component";
import { AssetConditionUpdateComponent } from "./update/asset-condition-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssetConditionRoutingModule],
  declarations: [AssetConditionComponent, AssetConditionUpdateComponent],
  entryComponents: [AssetConditionUpdateComponent],
})
export class AssetConditionModule {}
