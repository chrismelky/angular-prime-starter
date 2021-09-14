/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigurationSettingRoutingModule } from "./configuration-setting-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ConfigurationSettingComponent } from "./configuration-setting.component";
import { ConfigurationSettingUpdateComponent } from "./update/configuration-setting-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ConfigurationSettingRoutingModule],
  declarations: [
    ConfigurationSettingComponent,
    ConfigurationSettingUpdateComponent,
  ],
  entryComponents: [ConfigurationSettingUpdateComponent],
})
export class ConfigurationSettingModule {}
