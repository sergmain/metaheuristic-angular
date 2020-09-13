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
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
        this.store.subscribe(data => {
            this.settings = data.settings;
            this.updateSidenavState();
        });
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.roles = this.authenticationService.getUserRole();
    }



    accessSourceCodes() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_MANAGER) ||
            this.roles.has(Role.ROLE_DATA)
        ) {
            return true;
        }
        return false;
    }

    accessBatch() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_MANAGER) ||
            this.roles.has(Role.ROLE_OPERATOR)
        ) {
            return true;
        }
        return false;
    }

    accessFunctions() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_MANAGER) ||
            this.roles.has(Role.ROLE_DATA)
        ) {
            return true;
        }
        return false;
    }

    accessGlobalVariables() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_DATA)
        ) {
            return true;
        }
        return false;
    }


    accessExperiments() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_MANAGER) ||
            this.roles.has(Role.ROLE_DATA)
        ) {
            return true;
        }
        return false;
    }

    accessAtlas() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_DATA)
        ) {
            return true;
        }
        return false;
    }

    accessProcessors() {
        if (this.roles.has(Role.ROLE_ADMIN)) {
            return true;
        }
        return false;
    }

    accessAccounts() {
        if (this.roles.has(Role.ROLE_ADMIN)) {
            return true;
        }
        return false;
    }

    accessCompany() {
        if (this.roles.has(Role.ROLE_ADMIN) ||
            this.roles.has(Role.ROLE_MASTER_ADMIN)
        ) {
            return true;
        }
        return false;
    }

    private updateSidenavState() {
        this.sidenavOpened = false;
        if (this.settings.sidenav === true) {
            this.sidenavOpened = true;
        }
    }
}
