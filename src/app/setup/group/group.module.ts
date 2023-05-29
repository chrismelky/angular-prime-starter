/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { GroupComponent } from './group.component';
import { GroupUpdateComponent } from './update/group-update.component';
import { GroupRoleModule } from './group-role/group-role.module';
import { UserGroupModule } from './user-group/user-group.module';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        GroupRoutingModule,
        GroupRoleModule,
        UserGroupModule,
    ],
    declarations: [GroupComponent, GroupUpdateComponent]
})
export class GroupModule {}
