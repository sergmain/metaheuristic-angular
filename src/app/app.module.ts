import { CommonModule } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '@app/guards/auth/auth.guard';
import { AccountsService } from '@app/services/accounts/accounts.service';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppDialogConfirmationComponent } from './components/app-dialog-confirmation/app-dialog-confirmation.component';
import { AppIndexComponent } from './components/app-index/app-index.component';
import { AppViewComponent } from './components/app-view/app-view.component';
import { BatchChangeNotificationComponent } from './components/batch-change-notification/batch-change-notification.component';
import { BillingComponent } from './components/billing/billing.component';
import { LoginComponent } from './components/login/login.component';
import { LoremIndexComponent } from './components/lorem-index/lorem-index.component';
import { NavPilotComponent } from './components/nav-pilot/nav-pilot.component';
import { PilotComponent } from './components/pilot/pilot.component';
import { JwtInterceptor } from './jwt.interceptor';
import { SimpleNotificationsModule } from './modules/angular2-notifications/simple-notifications.module';

// import { CtModule } from './modules/ct/ct.module';

import { NotificationsInterceptor } from './notifications.interceptor';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/');
}


