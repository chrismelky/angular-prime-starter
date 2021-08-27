/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdvertisementRoutingModule } from "./advertisement-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { AdvertisementComponent } from "./advertisement.component";
import { AdvertisementUpdateComponent } from "./update/advertisement-update.component";
import {FileUploadModule} from "primeng/fileupload";

@NgModule({
  imports: [SharedModule, CommonModule, AdvertisementRoutingModule, FileUploadModule],
  declarations: [AdvertisementComponent, AdvertisementUpdateComponent],
  entryComponents: [AdvertisementUpdateComponent],
})
export class AdvertisementModule {}
