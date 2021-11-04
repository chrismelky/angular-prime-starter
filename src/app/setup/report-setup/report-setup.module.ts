/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportSetupRoutingModule } from "./report-setup-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ReportSetupComponent } from "./report-setup.component";
import { ReportSetupUpdateComponent } from "./update/report-setup-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ReportSetupRoutingModule],
  declarations: [ReportSetupComponent, ReportSetupUpdateComponent],
  entryComponents: [ReportSetupUpdateComponent],
})
export class ReportSetupModule {}
