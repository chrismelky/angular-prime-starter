import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from "../../shared/shared.module";
import {ChangePasswordComponent} from "./change-password.component";


@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
})
export class ChangePasswordModule {}
