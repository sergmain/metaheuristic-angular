import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { Router } from '@angular/router';
import { Settings } from '@src/app/services/settings/Settings';

@Component({
    selector: 'ai-root',
    templateUrl: './ai-root.component.html',
    styleUrls: ['./ai-root.component.sass']
})
export class AiRootComponent implements OnInit {

    settings: Settings;
    sidenavOpened: boolean;

    constructor(
        private store: Store<AppState>,
        private router: Router,
    ) {
        this.store.subscribe(data => {
            this.settings = data.settings;
            this.updateSidenavState();
        });
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void { }

    private updateSidenavState(): void {
        this.sidenavOpened = false;
        if (this.settings.sidenav === true) {
            this.sidenavOpened = true;
        }
    }
}
