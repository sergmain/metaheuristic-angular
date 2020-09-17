import { Component, OnInit } from '@angular/core';
import { AppState } from '@src/app/app.reducers';
import { Store } from '@ngrx/store';
import { Settings } from '@src/app/services/settings/Settings';
import { Role, AuthenticationService } from '@src/app/services/authentication';
import { Router } from '@angular/router';

@Component({
    selector: 'dispatcher-root',
    templateUrl: './dispatcher-root.component.html',
    styleUrls: ['./dispatcher-root.component.sass']
})
export class DispatcherRootComponent {

    settings: Settings;
    sidenavOpened: boolean;

    roles: Set<Role>;

    constructor(
        private store: Store<AppState>,
        public authenticationService: AuthenticationService,
        private router: Router,
    ) {
        this.store.subscribe(data => {
            this.settings = data.settings;
            this.updateSidenavState();
        });
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.roles = this.authenticationService.getUserRole();
    }

    private updateSidenavState(): void {
        this.sidenavOpened = false;
        if (this.settings.sidenav === true) {
            this.sidenavOpened = true;
        }
    }
}
