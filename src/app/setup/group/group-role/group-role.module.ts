/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { GroupRoleComponent } from './group-role.component';
import { GroupRoleUpdateComponent } from './update/group-role-update.component';
import { CreateComponent } from './create/create.component';

@NgModule({
    imports: [SharedModule, CommonModule],
    declarations: [GroupRoleComponent, GroupRoleUpdateComponent, CreateComponent]
})
export class GroupRoleModule {}
