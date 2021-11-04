/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PeSelectOptionRoutingModule} from "./pe-select-option-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {PeSelectOptionComponent} from "./pe-select-option.component";
import {PeSelectOptionUpdateComponent} from "./update/pe-select-option-update.component";
import {UploadComponent} from "./upload/upload.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeSelectOptionRoutingModule],
  declarations: [PeSelectOptionComponent, PeSelectOptionUpdateComponent, UploadComponent],
  entryComponents: [PeSelectOptionUpdateComponent, UploadComponent],
})
export class PeSelectOptionModule {
}
