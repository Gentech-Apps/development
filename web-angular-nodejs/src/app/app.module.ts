import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/services/auth.service';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './core/error-handler/ErrorInterceptor';
import { ErrorsModule } from './errors/errors.module';
import { LayoutComponent } from './layout/components/layout.component';
import { LayoutService } from './layout/service/layout-service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    MaterialModule,
    ErrorsModule,
  ],
  providers: [
    AuthService,
    LayoutService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
