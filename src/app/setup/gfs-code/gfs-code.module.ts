/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GfsCodeRoutingModule} from "./gfs-code-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {GfsCodeComponent} from "./gfs-code.component";
import {GfsCodeUpdateComponent} from "./update/gfs-code-update.component";
import {UploadComponent} from "./upload/upload.component";
import {GfsCodeSectionModule} from "./gfs-code-section/gfs-code-section.module";

@NgModule({
  imports: [SharedModule, CommonModule, GfsCodeRoutingModule, GfsCodeSectionModule],
  declarations: [GfsCodeComponent, GfsCodeUpdateComponent, UploadComponent],
  entryComponents: [GfsCodeUpdateComponent],
})
export class GfsCodeModule {
}
