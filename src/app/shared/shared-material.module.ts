import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  exports: [CommonModule, MatCardModule, MatExpansionModule, MatButtonModule],
})
export class SharedMaterialModule {}
