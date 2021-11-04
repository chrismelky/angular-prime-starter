/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OptionSetValueRoutingModule} from "./option-set-value-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {OptionSetValueComponent} from "./option-set-value.component";
import {OptionSetValueUpdateComponent} from "./update/option-set-value-update.component";
import {UploadComponent} from "./upload/upload.component";

@NgModule({
  imports: [SharedModule, CommonModule, OptionSetValueRoutingModule],
  declarations: [OptionSetValueComponent, OptionSetValueUpdateComponent, UploadComponent],
  entryComponents: [OptionSetValueUpdateComponent, UploadComponent],
})
export class OptionSetValueModule {
}
