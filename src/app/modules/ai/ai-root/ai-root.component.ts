import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { Settings } from '@app/services/settings/Settings';
import { SettingsService, SettingsServiceEventChange } from '@app/services/settings/settings.service';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { CtContentComponent } from '../../ct/ct-content/ct-content.component';
import { CtBackButtonComponent } from '../../ct/ct-back-button/ct-back-button.component';
import { CopyRightComponent } from '../../copy-right/copy-right/copy-right.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'ai-root',
    templateUrl: './ai-root.component.html',
    styleUrls: ['./ai-root.component.sass'],
    imports: [MatSidenavContainer, MatSidenav, MatButton, RouterLinkActive, RouterLink, MatSidenavContent, CtContentComponent, RouterOutlet, CtBackButtonComponent, CopyRightComponent, TranslateModule]
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
