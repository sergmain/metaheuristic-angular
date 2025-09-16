import {provideRouter, withHashLocation} from '@angular/router';
import {ROOT_ROUTES} from './app/app.routing.module';

import {enableProdMode, importProvidersFrom} from '@angular/core';


import {environment} from './environments/environment';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtInterceptor} from './app/jwt.interceptor';
import {NotificationsInterceptor} from './app/notifications.interceptor';
import {CommonModule} from '@angular/common';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from './app/app.module';
import {SimpleNotificationsModule} from './app/modules/angular2-notifications/simple-notifications.module';
import {AppComponent} from './app/app.component';

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
            ...(environment.hashLocationStrategy ? [withHashLocation()] : []),
            // Remove extraOptions for now to test
        ),
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