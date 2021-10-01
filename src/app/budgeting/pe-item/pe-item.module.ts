/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PeItemRoutingModule } from "./pe-item-routing.module";
import {SplitButtonModule} from 'primeng/splitbutton';

import { SharedModule } from "../../shared/shared.module";
import { PeItemComponent } from "./pe-item.component";
import { PeItemUpdateComponent } from "./update/pe-item-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, PeItemRoutingModule,SplitButtonModule],
  declarations: [PeItemComponent, PeItemUpdateComponent],
  entryComponents: [PeItemUpdateComponent],
})
export class PeItemModule {}
