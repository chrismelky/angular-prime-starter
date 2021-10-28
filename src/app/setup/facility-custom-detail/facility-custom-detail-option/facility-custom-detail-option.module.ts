/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {SharedModule} from "../../../shared/shared.module";
import {FacilityCustomDetailOptionComponent} from "./facility-custom-detail-option.component";
import {FacilityCustomDetailOptionUpdateComponent} from "./update/facility-custom-detail-option-update.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
  ],
  declarations: [
    FacilityCustomDetailOptionComponent,
    FacilityCustomDetailOptionUpdateComponent,
  ],
  entryComponents: [FacilityCustomDetailOptionUpdateComponent],
})
export class FacilityCustomDetailOptionModule {
}
