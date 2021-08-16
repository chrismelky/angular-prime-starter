import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { MainComponent } from './main/main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [MainComponent, MenuItemComponent, NotFoundComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    PanelMenuModule,
    ToastModule,
  ],
})
export class LayoutModule {}
