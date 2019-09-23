import { Component } from '@angular/core';
import { SettingsService } from '@services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from './services/settings/Settings';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'metaheuristic-app';
    constructor(
        private settingsService: SettingsService,
        private translate: TranslateService
    ) {
        this.settingsService.settingsObserver
            .subscribe((settings: Settings) =>
                this.translate.use(settings.language));
    }
}