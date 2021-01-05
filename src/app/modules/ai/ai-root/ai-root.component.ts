import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { Settings } from '@src/app/services/settings/Settings';
import { SettingsService } from '@src/app/services/settings/settings.service';

@Component({
    selector: 'ai-root',
    templateUrl: './ai-root.component.html',
    styleUrls: ['./ai-root.component.sass']
})
export class AiRootComponent extends UIStateComponent implements OnInit, OnDestroy {
    settings: Settings;
    sidenavOpened: boolean;

    constructor(
        private router: Router,
        private settingsService: SettingsService,
        readonly authenticationService: AuthenticationService
    ) {
        super(authenticationService);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.subs.push(this.settingsService.data.subscribe(settings => {
            this.settings = settings;
            this.sidenavOpened = this.settings.sidenav;
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }
}
