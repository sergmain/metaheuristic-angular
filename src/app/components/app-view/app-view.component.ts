import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { setOfLanguages, SettingsLanguage, SettingsTheme } from '@src/app/services/settings/Settings';
import { SettingsService, SettingsServiceEventChange } from '@src/app/services/settings/settings.service';
import { environment } from '@src/environments/environment';


@Component({
    selector: 'app-view',
    templateUrl: './app-view.component.html',
    styleUrls: ['./app-view.component.scss']
})

export class AppViewComponent extends UIStateComponent implements OnInit, OnDestroy {
    htmlContent: SafeHtml;
    sidenavButtonDisable: boolean = false;
    sidenav: boolean = false;
    theme: SettingsTheme;
    lang: {
        list?: Set<SettingsLanguage>;
        current?: SettingsLanguage;
    } = {};
    brandingTitle: string = environment.brandingTitle;

    @ViewChild('matSlideToggleTheme') matSlideToggleTheme: MatSlideToggle;
    @ViewChild('matSelectLanguage') matSelectLanguage: MatSelect;

    constructor(
        readonly authenticationService: AuthenticationService,
        private domSanitizer: DomSanitizer,
        private settingsService: SettingsService,
        private router: Router
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.htmlContent = this.domSanitizer.bypassSecurityTrustHtml(
            environment.brandingMsgIndex
        );
        this.lang.list = setOfLanguages;
        this.subscribeSubscription(this.router.events.subscribe((event) => {
            if (event instanceof ActivationEnd) {
                this.sidenavButtonDisable = !event.snapshot?.data?.sidenavExist;
            }
        }));
        this.subscribeSubscription(
            this.settingsService.events.subscribe(event => {
                if (event instanceof SettingsServiceEventChange) {
                    this.theme = event.settings.theme;
                    this.lang.current = event.settings.language;
                    this.sidenav = event.settings.sidenav;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    isAuth(): boolean {
        return this.authenticationService.isAuth();
    }

    toggleSideNav(): void {
        this.settingsService.toggleSidenav();
    }

    toggleTheme(event: MatSlideToggleChange): void {
        this.settingsService.toggleTheme();
    }

    toggleLanguage(event: MatSelectChange): void {
        this.settingsService.toggleLanguage(event.value);
    }

    logout(): void {
        this.authenticationService.logout().subscribe();
    }
}