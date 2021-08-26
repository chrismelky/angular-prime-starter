/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CeilingChainRoutingModule } from "./ceiling-chain-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { CeilingChainComponent } from "./ceiling-chain.component";
import { CeilingChainUpdateComponent } from "./update/ceiling-chain-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, CeilingChainRoutingModule],
  declarations: [CeilingChainComponent, CeilingChainUpdateComponent],
  entryComponents: [CeilingChainUpdateComponent],
})
export class CeilingChainModule {}
