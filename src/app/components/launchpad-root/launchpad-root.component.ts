import { Component, OnInit } from '@angular/core';
import { Settings, SettingsSidenavState } from '@src/app/services/settings/Settings';
import { SettingsService } from '@src/app/services/settings/settings.service';

@Component({
    selector: 'launchpad-root',
    templateUrl: './launchpad-root.component.pug',
    styleUrls: ['./launchpad-root.component.scss']
})
export class LaunchpadRootComponent implements OnInit {
    settings: Settings;
    sidenavOpened: boolean;

    constructor(
        private settingsService: SettingsService,

    ) {
        this.settingsService.settingsObserver.subscribe((settings: any) => {
            this.settings = settings;
            this.updateSidenavState();
        });
    }

    private updateSidenavState() {
        this.sidenavOpened = false;
        if (this.settings.sidenavState === SettingsSidenavState.Open) {
            this.sidenavOpened = true;
        }
    }

    ngOnInit() {}

}