import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [],
  exports: [FormsModule, ReactiveFormsModule, FlexLayoutModule, MatChipsModule],
})
export class SharedMaterialModule {
}
