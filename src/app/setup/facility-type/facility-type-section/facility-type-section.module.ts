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
import {FacilityTypeSectionComponent} from "./facility-type-section.component";
import {FacilityTypeSectionUpdateComponent} from "./update/facility-type-section-update.component";
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [
    FacilityTypeSectionComponent,
    FacilityTypeSectionUpdateComponent,
    CreateComponent,
  ],
  entryComponents: [FacilityTypeSectionComponent, FacilityTypeSectionUpdateComponent],
})
export class FacilityTypeSectionModule {
}
