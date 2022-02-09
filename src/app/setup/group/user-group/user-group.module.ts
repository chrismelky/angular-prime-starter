/**  * @license */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { UserGroupComponent } from './user-group.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [UserGroupComponent, CreateComponent],
  entryComponents: [],
})
export class UserGroupModule {}
