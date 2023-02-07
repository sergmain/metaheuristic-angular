import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UIStateComponent } from './models/UIStateComponent';
import { AuthenticationService, AuthenticationServiceEventChange, AuthenticationServiceEventLogin, AuthenticationServiceEventLogout } from './services/authentication';
import { BatchExecStatusService } from '@services/batch/BatchExecStatusService';
import { SettingsService, SettingsServiceEventChange } from '@services/settings/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends UIStateComponent implements OnInit, OnDestroy {
    constructor(
        private translate: TranslateService,
        private batchExexStatusService: BatchExecStatusService,
        readonly authenticationService: AuthenticationService,
        private settingsService: SettingsService
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.subscribeSubscription(
            this.settingsService.events.subscribe(event => {
                if (event instanceof SettingsServiceEventChange) {
                    this.translate.use(event.settings.language);
                }
            })
        );

        this.subscribeSubscription(
            this.authenticationService.events.subscribe(event => {
                if (event instanceof AuthenticationServiceEventChange) {
                    if (event.user) {
                        this.batchExexStatusService.startIntervalRequset();
                    }
                }

                if (event instanceof AuthenticationServiceEventLogout) {
                    this.batchExexStatusService.stopIntervalRequset();
                }
            })
        );
    }
    ngOnDestroy(): void { this.unsubscribeSubscriptions(); }
}