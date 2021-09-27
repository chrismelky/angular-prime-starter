import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {CommonModule} from '@angular/common';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {MessageService} from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {ErrorHandlerInterceptor} from './interceptors/error-handler.interceptor';
import {AuthExpiredInterceptor} from './interceptors/auth-expired.interceptor';
import {RippleModule} from 'primeng/ripple';
import {LoaderInterceptor} from "./shared/loader-interceptor";
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    RippleModule,
    NgxWebstorageModule.forRoot({
      prefix: 'planrep',
      separator: '-',
      caseSensitive: true,
    }),
    MessageModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor ,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
