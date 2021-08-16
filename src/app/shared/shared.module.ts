import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';

@NgModule({
  declarations: [],
  imports: [SharedMaterialModule, SharedPrimengModule],
  exports: [SharedMaterialModule, SharedPrimengModule, CommonModule],
})
export class SharedModule {}
