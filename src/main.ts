import { provideRouter, withHashLocation } from '@angular/router';
import { ROOT_ROUTES, extraOptions } from './app/app.routing.module';

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './app/jwt.interceptor';
import { NotificationsInterceptor } from './app/notifications.interceptor';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
// import { AppRoutingModule } from './app/app.routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
// import { CtModule } from './app/modules/ct/ct.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app/app.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SimpleNotificationsModule } from './app/modules/angular2-notifications/simple-notifications.module';
import { AppComponent } from './app/app.component';

if (environment.isSslRequired) {
    if (window.location.protocol === 'http:') {
        window.location.href = window.location.href.replace('http', 'https');
    }
}

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            CommonModule,
            BrowserModule,
            // Remove: AppRoutingModule,
            // CtModule,
            FormsModule,
            ReactiveFormsModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
            SimpleNotificationsModule.forRoot()
        ),
        // Add the new router provider
        provideRouter(
            ROOT_ROUTES,
            ...(environment.hashLocationStrategy ? [withHashLocation()] : [])
            // Note: onSameUrlNavigation: 'reload' is handled automatically in newer Angular
        ),
        // AuthGuard,
        // AuthenticationService,
        // AccountsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationsInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
    .catch(err => console.error(err));