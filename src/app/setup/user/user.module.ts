/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { UserComponent } from './user.component';
import { UserUpdateComponent } from './update/user-update.component';
import { UserRoleModule } from './user-role/user-role.module';
import { UserGroupModule } from './user-group/user-group.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    UserRoleModule,
    UserGroupModule,
    UserRoutingModule,
  ],
  declarations: [UserComponent, UserUpdateComponent, PasswordResetComponent],
  entryComponents: [UserUpdateComponent],
})
export class UserModule {}
