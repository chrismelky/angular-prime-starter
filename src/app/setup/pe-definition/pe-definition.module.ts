/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeDefinitionRoutingModule } from "./pe-definition-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { PeDefinitionComponent } from "./pe-definition.component";
import { PeDefinitionUpdateComponent } from "./update/pe-definition-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeDefinitionRoutingModule],
  declarations: [PeDefinitionComponent, PeDefinitionUpdateComponent],
  entryComponents: [PeDefinitionUpdateComponent],
})
export class PeDefinitionModule {}
