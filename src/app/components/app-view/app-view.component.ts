import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { Store } from '@ngrx/store';
import { setOfLanguages, SettingsLanguage, SettingsTheme } from '@src/app/services/settings/Settings';
import { SettingsService } from '@src/app/services/settings/settings.service';
import { AppState } from '@src/app/app.reducers';
import * as settingsAction from '@src/app/services/settings/settings.actions';
import { BatchService } from '@src/app/services/batch/batch.service';
import { AudioNotification } from '@src/app/services/audioNotification/audioNotification.service';
import * as authenticationAction from '@src/app/services/authentication/authentication.actions';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { environment } from '@src/environments/environment';


@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.html',
    styleUrls: ['./app-view.component.scss']
})

export class AppViewComponent implements OnInit, OnDestroy {
    htmlContent: SafeHtml;
    sidenavButtonDisable: boolean = false;
    theme: SettingsTheme;
    lang: {
        list?: Set<SettingsLanguage>;
        current?: SettingsLanguage;
    } = {};
    batchFinished: boolean = false;
    brandingTitle: string = environment.brandingTitle;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild('matSlideToggleTheme') matSlideToggleTheme: MatSlideToggle;
    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        private authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private router: Router,
        private batchService: BatchService,
        private audioNotification: AudioNotification,
        private store: Store<AppState>,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.htmlContent = this.domSanitizer.bypassSecurityTrustHtml(environment.brandingMsgIndex);
        this.lang.list = setOfLanguages;
        this.store.subscribe((state: AppState) => {
            this.theme = state.settings.theme;
            this.lang.current = state.settings.language;
        });

        this.batchService.finishedNotification.subscribe((exist: boolean) => {
            if (exist) {
                this.audioNotification.play();
                this.batchFinished = true;
            }
        });
    }

    ngOnDestroy() { }

    isAuth() {
        return this.authenticationService.isAuth();
    }

    hideBatchNotification() {
        this.batchFinished = false;
    }

    toggleSideNav() {
        this.store.dispatch(settingsAction.toggleSideNav());
    }

    toggleTheme(event: MatSlideToggleChange) {
        if (event.checked) {
            this.store.dispatch(settingsAction.setDarkTheme());
        } else {
            this.store.dispatch(settingsAction.setLightTheme());
        }

    }

    toggleLanguage(event: MatSelectChange) {
        this.store.dispatch(settingsAction.toggleLanguage({ language: event.value }));
    }

    logout() {
        this.store.dispatch(authenticationAction.logout());
    }
}