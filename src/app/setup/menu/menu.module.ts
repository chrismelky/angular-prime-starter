/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { MenuComponent } from './menu.component';
import { MenuUpdateComponent } from './update/menu-update.component';
import { MenuPermissionModule } from './menu-permission/menu-permission.module';
import { SubComponent } from './sub/sub.component';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        MenuRoutingModule,
        MenuPermissionModule,
    ],
    declarations: [MenuComponent, MenuUpdateComponent, SubComponent]
})
export class MenuModule {}
