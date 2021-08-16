import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    NgxWebstorageModule.forRoot(),
    MessageModule,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
