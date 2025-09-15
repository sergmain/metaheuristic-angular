import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { Settings } from '@app/services/settings/Settings';
import { SettingsService, SettingsServiceEventChange } from '@app/services/settings/settings.service';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CtContentComponent } from '../../ct/ct-content/ct-content.component';
import { CtBackButtonComponent } from '../../ct/ct-back-button/ct-back-button.component';
import { CopyRightComponent } from '../../copy-right/copy-right/copy-right.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone : true,
    selector: 'dispatcher-root',
    templateUrl: './dispatcher-root.component.html',
    styleUrls: ['./dispatcher-root.component.sass'],
    imports: [MatSidenavContainer, MatSidenav, NgIf, MatButton, RouterLinkActive, RouterLink, MatSidenavContent, CtContentComponent, RouterOutlet, CtBackButtonComponent, CopyRightComponent, TranslateModule]
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
