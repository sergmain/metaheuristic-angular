import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange, MatSidenav, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { Store } from '@ngrx/store';
import { Settings, SettingsLanguage, SettingsTheme } from '@src/app/services/settings/Settings';
import { setOfLanguages, SettingsService } from '@src/app/services/settings/settings.service';
import { IAppState } from '../../app.reducers';
import * as settingsServiceActions from '../../services/settings/settings.actions';

@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.html',
    styleUrls: ['./app-view.component.scss']
})

export class AppViewComponent implements OnInit {
    sidenavButtonDisable: boolean = false;
    theme: SettingsTheme;
    lang: {
        list ? : Set < SettingsLanguage > ;
        current ? : SettingsLanguage;
    } = {};

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild('matSlideToggleTheme') matSlideToggleTheme: MatSlideToggle;
    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        private authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private router: Router,
        private store: Store < IAppState >
    ) {}

    ngOnInit() {
        this.lang.list = setOfLanguages;
        this.store.subscribe((state: IAppState) => {
            this.theme = state.settings.theme;
            this.lang.current = state.settings.language;
        });
        this.isAuth();
    }

    private updateSidenav() {
        // this.sidenavButtonDisable = true;
        // if (this.settings.sidenav === SettingsSidenav.Enable) {
        //     this.sidenavButtonDisable = false;
        // }
    }

    isAuth() {
        return this.authenticationService.isAuth();
    }

    toggleSideNav() {
        this.store.dispatch(settingsServiceActions.toggleSideNav());
    }

    toggleTheme(event: MatSlideToggleChange) {
        if (event.checked) {
            this.store.dispatch(settingsServiceActions.setDarkTheme());
        } else {
            this.store.dispatch(settingsServiceActions.setLightTheme());
        }

    }

    toggleLanguage(event: MatSelectChange) {
        this.store.dispatch(settingsServiceActions.toggleLanguage({ language: event.value }));
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
}