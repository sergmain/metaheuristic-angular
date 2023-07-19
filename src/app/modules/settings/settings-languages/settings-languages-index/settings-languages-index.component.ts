import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '@app/modules/settings/settings.service';

@Component({
    selector: "settings-languages-index",
    templateUrl: './settings-languages-index.component.html',
    styleUrls: ['./settings-languages-index.component.scss'],
})
export class SettingsLanguagesIndexComponent {

    constructor(
        private settingsService: SettingsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }
}