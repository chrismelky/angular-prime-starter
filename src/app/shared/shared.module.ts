import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from './shared-material.module';
import { SharedPrimengModule } from './shared-primeng.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedMaterialModule, SharedPrimengModule],
  exports: [SharedMaterialModule, SharedPrimengModule],
})
export class SharedModule {}
