/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FundSourceRoutingModule } from "./fund-source-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { FundSourceComponent } from "./fund-source.component";
import { FundSourceUpdateComponent } from "./update/fund-source-update.component";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {FieldsetModule} from 'primeng/fieldset';
import { ViewBudgetClassComponent } from './update/view-budget-class.component';
import { ViewGfsCodeComponent } from './update/view-gfs-code.component';

@NgModule({
  imports: [SharedModule, CommonModule, FundSourceRoutingModule,DynamicDialogModule,FieldsetModule],
  declarations: [FundSourceComponent, FundSourceUpdateComponent,ViewBudgetClassComponent, ViewGfsCodeComponent],
  entryComponents: [FundSourceUpdateComponent],
})
export class FundSourceModule {}
