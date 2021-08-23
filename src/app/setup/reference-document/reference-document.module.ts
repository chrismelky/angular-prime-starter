/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReferenceDocumentRoutingModule } from "./reference-document-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ReferenceDocumentComponent } from "./reference-document.component";
import { ReferenceDocumentUpdateComponent } from "./update/reference-document-update.component";

@NgModule({
  imports: [SharedModule, CommonModule, ReferenceDocumentRoutingModule],
  declarations: [ReferenceDocumentComponent, ReferenceDocumentUpdateComponent],
  entryComponents: [ReferenceDocumentUpdateComponent],
})
export class ReferenceDocumentModule {}
