import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@src/app/services/settings/settings.service';
import { IAppState } from './app.reducers';
import * as settingsActions from './services/settings/settings.actions';
import * as authenticationActions from './services/authentication/authentication.action';

import { BatchService } from './services/batch/batch.service';
import { environment } from '@src/environments/environment';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'metaheuristic-app';
    constructor(
        private settingsService: SettingsService,
        private translate: TranslateService,
        private store: Store < IAppState > ,
        private batchService: BatchService
    ) {
        this.store.subscribe((state: IAppState) => {
            this.translate.use(state.settings.language);
            if (state.user && state.user.username) {
                if (environment.batchInterval === 0) { return false; }
                this.batchService.startIntervalRequset(environment.batchInterval ? environment.batchInterval : 15000);
            } else {
                this.batchService.stopIntervalRequset();
            }
        });
        this.store.dispatch(authenticationActions.initional());
        this.store.dispatch(settingsActions.getAll());
    }
}