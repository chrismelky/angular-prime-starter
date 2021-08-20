/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReferenceDocumentTypeRoutingModule } from "./reference-document-type-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ReferenceDocumentTypeComponent } from "./reference-document-type.component";
import { ReferenceDocumentTypeUpdateComponent } from "./update/reference-document-type-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ReferenceDocumentTypeRoutingModule],
  declarations: [
    ReferenceDocumentTypeComponent,
    ReferenceDocumentTypeUpdateComponent,
  ],
  entryComponents: [ReferenceDocumentTypeUpdateComponent],
})
export class ReferenceDocumentTypeModule {}
