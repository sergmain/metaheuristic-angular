import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import * as authenticationAction from '@src/app/services/authentication/authentication.actions';
import { setOfLanguages, SettingsLanguage, SettingsTheme } from '@src/app/services/settings/Settings';
import * as settingsAction from '@src/app/services/settings/settings.actions';
import { environment } from '@src/environments/environment';


@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.html',
    styleUrls: ['./app-view.component.scss']
})

export class AppViewComponent extends UIStateComponent implements OnInit {
    htmlContent: SafeHtml;
    sidenavButtonDisable: boolean = false;
    theme: SettingsTheme;
    lang: {
        list?: Set<SettingsLanguage>;
        current?: SettingsLanguage;
    } = {};
    brandingTitle: string = environment.brandingTitle;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild('matSlideToggleTheme') matSlideToggleTheme: MatSlideToggle;
    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        readonly authenticationService: AuthenticationService,
        private store: Store<AppState>,
        private domSanitizer: DomSanitizer,
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.htmlContent = this.domSanitizer.bypassSecurityTrustHtml(environment.brandingMsgIndex);
        this.lang.list = setOfLanguages;
        this.store.subscribe((state: AppState) => {
            this.theme = state.settings.theme;
            this.lang.current = state.settings.language;
        });

    }

    isAuth(): boolean {
        return this.authenticationService.isAuth();
    }

    toggleSideNav(): void {
        this.store.dispatch(settingsAction.toggleSideNav());
    }

    toggleTheme(event: MatSlideToggleChange): void {
        if (event.checked) {
            this.store.dispatch(settingsAction.setDarkTheme());
        } else {
            this.store.dispatch(settingsAction.setLightTheme());
        }

    }

    toggleLanguage(event: MatSelectChange): void {
        this.store.dispatch(settingsAction.toggleLanguage({ language: event.value }));
    }

    logout(): void {
        this.store.dispatch(authenticationAction.logout());
    }
}