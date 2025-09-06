import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { Settings } from '@src/app/services/settings/Settings';
import { SettingsService, SettingsServiceEventChange } from '@src/app/services/settings/settings.service';

@Component({
    selector: 'ai-root',
    templateUrl: './ai-root.component.html',
    styleUrls: ['./ai-root.component.sass'],
    standalone: false
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
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.settings = event.settings;
                this.sidenavOpened = event.settings.sidenav;
            }
        }));
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }
}
