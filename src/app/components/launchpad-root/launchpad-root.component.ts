import { Component, OnInit } from '@angular/core';
import { Settings } from '@src/app/services/settings/Settings';
import { Store } from '@ngrx/store';
import { IAppState } from '@src/app/app.reducers';

@Component({
    selector: 'launchpad-root',
    templateUrl: './launchpad-root.component.html',
    styleUrls: ['./launchpad-root.component.scss']
})
export class LaunchpadRootComponent implements OnInit {
    settings: Settings;
    sidenavOpened: boolean;

    constructor(
        private store: Store < IAppState >

    ) {
        this.store.subscribe((data: IAppState) => {
            this.settings = data.settings;
            this.updateSidenavState();
        });
    }

    private updateSidenavState() {
        this.sidenavOpened = false;
        if (this.settings.sidenav === true) {
            this.sidenavOpened = true;
        }
    }

    ngOnInit() {}

}