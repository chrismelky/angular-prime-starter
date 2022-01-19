/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { ReportComponent } from './report.component';
import { ReportUpdateComponent } from './update/report-update.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PreviewComponent } from './preview/preview.component';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReportRoutingModule,
    SplitButtonModule,
    SidebarModule,
  ],
  declarations: [ReportComponent, ReportUpdateComponent, PreviewComponent],
  entryComponents: [ReportUpdateComponent],
})
export class ReportModule {}
