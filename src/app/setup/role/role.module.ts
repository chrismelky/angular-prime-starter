/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule } from './role-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { RoleComponent } from './role.component';
import { RoleUpdateComponent } from './update/role-update.component';

@NgModule({
    imports: [SharedModule, CommonModule, RoleRoutingModule],
    declarations: [RoleComponent, RoleUpdateComponent]
})
export class RoleModule {}
