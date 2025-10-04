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
import {provideTranslateService, TranslateLoader, TranslateModule, TranslationObject} from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import {AppComponent} from './app/app.component';
import { Observable, map } from 'rxjs';
import { parse } from 'yaml';
import { provideZonelessChangeDetection } from '@angular/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

class TranslateYamlHttpLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        public path: string = 'assets/i18n/'
    ) {}

    public getTranslation(lang: string): Observable<TranslationObject> {
        let url = `${this.path}${lang}.yaml`;
        console.log('translation lang, url: ', lang, url);
        return this.http
            .get(url, { responseType: 'text' })
            .pipe(map((data) => parse(data)));
    }
}

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
        provideZonelessChangeDetection(),
        importProvidersFrom(
            // CommonModule,
            // BrowserModule,
            FormsModule,
            ReactiveFormsModule,
/*
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
*/
        ),
        provideTranslateService({
            loader: provideTranslateHttpLoader({
                prefix: './assets/i18n/',  // Your path from before
                suffix: '.json'
            }),
            fallbackLang: 'EN',  // Adjust as needed
            // Add fallbackLanguage if desired
        }),
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
        provideAnimations(),
        provideToastr({
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            progressBar: true,
            closeButton: true,
            preventDuplicates: true,
        })
    ]
})
    .catch(err => console.error(err));