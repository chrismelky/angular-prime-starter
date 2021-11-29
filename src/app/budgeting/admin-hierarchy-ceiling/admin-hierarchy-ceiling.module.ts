/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminHierarchyCeilingRoutingModule } from "./admin-hierarchy-ceiling-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdminHierarchyCeilingComponent } from "./admin-hierarchy-ceiling.component";
import { AdminHierarchyCeilingUpdateComponent } from "./update/admin-hierarchy-ceiling-update.component";
import { InitiateCeilingComponent } from './update/initiate-ceiling.component';
import {BadgeModule} from "primeng/badge";
import {SplitButtonModule} from "primeng/splitbutton";
import { UploadCeilingComponent } from './update/upload-ceiling.component';
import { LockCeilingComponent } from './update/lock-ceiling.component';
import { AdminCeilingDisseminationComponent } from './update/admin-ceiling-dissemination.component';
import { AddAttachmentComponent } from './add-attachment/add-attachment.component';

@NgModule({
    imports: [SharedModule, CommonModule, AdminHierarchyCeilingRoutingModule, BadgeModule, SplitButtonModule],
  declarations: [
    AdminHierarchyCeilingComponent,
    AdminHierarchyCeilingUpdateComponent,
    InitiateCeilingComponent,
    UploadCeilingComponent,
    LockCeilingComponent,
    AdminCeilingDisseminationComponent,
    AddAttachmentComponent,
  ],
  entryComponents: [AdminHierarchyCeilingUpdateComponent],
})
export class AdminHierarchyCeilingModule {}
