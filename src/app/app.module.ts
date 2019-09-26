import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AppDialogConfirmationComponent } from './components/app-dialog-confirmation/app-dialog-confirmation.component';
import { AppViewComponent } from './components/app-view/app-view.component';
import { BillingComponent } from './components/billing/billing.component';
import { LoginComponent } from './components/login/login.component';
import { LoremIndexComponent } from './components/lorem-index/lorem-index.component';
import { NavPilotComponent } from './components/nav-pilot/nav-pilot.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { JwtInterceptor } from './jwt.interceptor';
import { CopyRightModule } from './modules/copy-right.module';
import { CtAppModule } from './modules/ct.module';
import { MaterialAppModule } from './ngmaterial.module';
import { NotificationsInterceptor } from './notifications.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


@NgModule({
    declarations: [
        AppComponent,
        AppViewComponent,

        PilotComponent,
        NavPilotComponent,
        LoginComponent,
        BillingComponent,

        LoremIndexComponent,
        AppDialogConfirmationComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialAppModule,
        CtAppModule,
        CopyRightModule,
        FormsModule,
        ReactiveFormsModule,
        NgxJsonViewerModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SimpleNotificationsModule.forRoot()
    ],
    entryComponents: [
        AppDialogConfirmationComponent,
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        AccountsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationsInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}