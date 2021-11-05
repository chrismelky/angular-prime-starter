/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NationalReferenceRoutingModule} from "./national-reference-routing.module";

import {SharedModule} from "../../shared/shared.module";
import {NationalReferenceComponent} from "./national-reference.component";
import {NationalReferenceUpdateComponent} from "./update/national-reference-update.component";
import {UploadComponent} from "./upload/upload.component";

@NgModule({
  imports: [SharedModule, CommonModule, NationalReferenceRoutingModule],
  declarations: [NationalReferenceComponent, NationalReferenceUpdateComponent, UploadComponent],
  entryComponents: [NationalReferenceUpdateComponent, UploadComponent],
})
export class NationalReferenceModule {
}
