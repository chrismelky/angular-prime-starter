/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GroupRoutingModule } from "./group-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { GroupComponent } from "./group.component";
import { GroupUpdateComponent } from "./update/group-update.component";
import {GroupRoleModule} from "./group-role/group-role.module";

@NgModule({
  imports: [SharedModule, CommonModule, GroupRoutingModule, GroupRoleModule],
  declarations: [GroupComponent, GroupUpdateComponent],
  entryComponents: [GroupUpdateComponent],
})
export class GroupModule {}
