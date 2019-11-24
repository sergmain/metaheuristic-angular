import { Component } from '@angular/core';
import { SettingsService } from '@src/app/services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from './services/settings/Settings';
import { Store } from '@ngrx/store';
import { IAppState } from './app.reducers';
import * as settingsServiceActions from './services/settings/settings.actions';

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
        private store: Store < IAppState >
    ) {
        this.store.subscribe((state: IAppState) => {
            this.translate.use(state.settings.language);
        });
        this.store.dispatch(settingsServiceActions.getAll());
    }
}