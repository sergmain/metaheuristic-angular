import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';
import { Settings } from '@src/app/services/settings/Settings';
import { SettingsService, SettingsServiceEventChange } from '@src/app/services/settings/settings.service';

@Component({
    selector: 'dispatcher-root',
    templateUrl: './dispatcher-root.component.html',
    styleUrls: ['./dispatcher-root.component.sass']
})
export class DispatcherRootComponent extends UIStateComponent implements OnInit, OnDestroy {
    settings: Settings;
    sidenavOpened: boolean;

    constructor(
        public authenticationService: AuthenticationService,
        private router: Router,
        private settingsService: SettingsService
    ) {
        super(authenticationService);
        // повторным кликом перезагружаем страницу
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.subscribeSubscription(
            this.settingsService.events.subscribe(event => {
                if (event instanceof SettingsServiceEventChange) {
                    this.settings = event.settings;
                    this.sidenavOpened = event.settings.sidenav;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }
}
