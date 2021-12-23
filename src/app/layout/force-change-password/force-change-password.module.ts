import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';

import {SharedModule} from "../../shared/shared.module";
import {ForceChangePasswordComponent} from "./force-change-password.component";
import {TooltipModule} from 'primeng/tooltip';
import {BadgeModule} from 'primeng/badge';





@NgModule({
  declarations: [ForceChangePasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    PasswordModule,
    TooltipModule,
    BadgeModule

  ],
})
export class ForceChangePasswordModule {}
