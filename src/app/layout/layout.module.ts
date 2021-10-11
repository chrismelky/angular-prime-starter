import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { MainComponent } from './main/main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotFoundComponent } from './not-found/not-found.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BlockUIModule } from 'primeng/blockui';
import { RippleModule } from 'primeng/ripple';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {ChangePasswordModule} from "./change-password/change-password.module";

@NgModule({
  declarations: [MainComponent, NotFoundComponent, PermissionDeniedComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    AvatarModule,
    PanelMenuModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    BlockUIModule,
    RippleModule,
    MatProgressBarModule,
    ChangePasswordModule
  ],
})
export class LayoutModule {}
