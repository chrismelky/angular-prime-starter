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
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from "primeng/tabview";

@NgModule({
  imports: [SharedModule, TabMenuModule, CommonModule, ConfigurationSettingRoutingModule, TabViewModule],
  declarations: [
    ConfigurationSettingComponent,
    ConfigurationSettingUpdateComponent,
  ],
  entryComponents: [ConfigurationSettingUpdateComponent],
})
export class ConfigurationSettingModule {}
