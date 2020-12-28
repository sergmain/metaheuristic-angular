import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@src/environments/environment';
import { AppState } from './app.reducers';
import { AuthenticationService } from './services/authentication';
import * as authenticationActions from './services/authentication/authentication.actions';
import { BatchService } from './services/batch/batch.service';
import { BatchExexStatusService } from './services/batch/BatchExecStatusService';
import * as settingsActions from './services/settings/settings.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        private store: Store<AppState>,
        private batchService: BatchService,
        private batchExexStatusService: BatchExexStatusService,
        private authenticationService: AuthenticationService
    ) {
        this.store.subscribe((state: AppState) => {
            this.translate.use(state.settings.language);
        });
        this.store.dispatch(authenticationActions.initional());
        this.store.dispatch(settingsActions.getAll());
    }

    ngOnInit(): void {
        this.authenticationService.userDataChanges.subscribe(user => {
            if (user && user.username) {
                this.batchExexStatusService.startIntervalRequset();
            } else {
                this.batchExexStatusService.stopIntervalRequset();
            }
        });
    }
}