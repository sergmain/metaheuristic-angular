import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@src/environments/environment';
import { AppState } from './app.reducers';
import * as authenticationActions from './services/authentication/authentication.actions';
import { BatchService } from './services/batch/batch.service';
import * as settingsActions from './services/settings/settings.actions';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private translate: TranslateService,
        private store: Store < AppState > ,
        private batchService: BatchService
    ) {
        this.store.subscribe((state: AppState) => {
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