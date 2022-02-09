/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { UserRoleComponent } from './user-role.component';
import { UserRoleUpdateComponent } from './update/user-role-update.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [UserRoleComponent, UserRoleUpdateComponent, CreateComponent],
  entryComponents: [UserRoleUpdateComponent],
})
export class UserRoleModule {}
