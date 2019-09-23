import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSidenav, MatSlideToggle } from '@angular/material';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { setOfLanguages, SettingsService } from '@app/services/settings/settings.service';
import { Subscription } from 'rxjs';
import { Settings, SettingsLanguage, SettingsSidenav, SettingsSidenavState, SettingsTheme } from '@src/app/services/settings/Settings';



@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.pug',
    styleUrls: ['./app-view.component.scss']
})

export class AppViewComponent implements OnInit {
    sidenavButtonDisable: boolean = false;
    themeState: boolean = false;
    language: any;
    languages: Set < SettingsLanguage > = setOfLanguages;
    settings: Settings;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
    @ViewChild('matSlideToggleTheme') matSlideToggleTheme: MatSlideToggle;
    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        private authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        // this.router.events.subscribe((event: RouterEvent) => {
        //     if (event instanceof NavigationStart) {

        //     }
        //     if (event instanceof NavigationEnd) {

        //     }
        //     if (event instanceof NavigationError) {

        //     }
        //     if (event instanceof NavigationCancel) {

        //     }
        //     if (event instanceof RoutesRecognized) {
        //         this.updateSidenavState(event.state.root.firstChild.data);
        //         // console.log(this);
        //     }
        // });
    }

    ngOnInit() {
        this.settingsService.settingsObserver.subscribe((settings: any) => {
            this.settings = settings;
            this.updateSidenav();
            this.updateThemeState();
        });
        this.isAuth();
    }

    private updateThemeState() {
        this.themeState = false;
        if (this.settings.theme === SettingsTheme.Dark) {
            this.themeState = true;
        }
    }

    private updateSidenav() {
        this.sidenavButtonDisable = true;
        if (this.settings.sidenav === SettingsSidenav.Enable) {
            this.sidenavButtonDisable = false;
        }
    }

    isAuth() {
        return this.authenticationService.isAuth();
    }

    toggleSidenav() {
        this.settingsService.toggleSidenav();
    }

    toggleTheme(event: any) {
        this.settingsService.toggleTheme(event.checked);
    }

    toggleLanguage() {
        this.settingsService.toggleLanguage(this.matSelectLanguage.value);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
}