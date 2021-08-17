import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [],
  imports: [SharedMaterialModule, SharedPrimengModule],
  exports: [SharedMaterialModule, SharedPrimengModule, CommonModule],
  providers: [ConfirmationService, DialogService],
})
export class SharedModule {}
