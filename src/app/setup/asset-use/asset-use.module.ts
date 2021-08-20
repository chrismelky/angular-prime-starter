/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetUseRoutingModule } from "./asset-use-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AssetUseComponent } from "./asset-use.component";
import { AssetUseUpdateComponent } from "./update/asset-use-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, AssetUseRoutingModule],
  declarations: [AssetUseComponent, AssetUseUpdateComponent],
  entryComponents: [AssetUseUpdateComponent],
})
export class AssetUseModule {}
