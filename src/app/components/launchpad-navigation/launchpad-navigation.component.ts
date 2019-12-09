import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, Role } from '@src/app/services/authentication';

@Component({
    selector: 'launchpad-navigation',
    templateUrl: './launchpad-navigation.component.html',
    styleUrls: ['./launchpad-navigation.component.scss']
})
export class LaunchpadNavigationComponent {

    userRole: Set < Role > ;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.userRole = this.authenticationService.getUserRole();
    }

    accessPlans() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Manager) ||
            this.userRole.has(Role.Data)
        ) {
            return true;
        }
        return false;
    }

    accessBatch() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Manager) ||
            this.userRole.has(Role.Operator)
        ) {
            return true;
        }
        return false;
    }

    accessExperiments() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Manager) ||
            this.userRole.has(Role.Data)
        ) {
            return true;
        }
        return false;
    }

    accessAtlas() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Data)
        ) {
            return true;
        }
        return false;
    }

    accessResourses() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Data)
        ) {
            return true;
        }
        return false;
    }

    accessSnippets() {
        if (this.userRole.has(Role.Admin) ||
            this.userRole.has(Role.Manager) ||
            this.userRole.has(Role.Data)
        ) {
            return true;
        }
        return false;
    }

    accessStations() {
        if (this.userRole.has(Role.Admin)

        ) {
            return true;
        }
        return false;
    }

    accessAccounts() {
        if (this.userRole.has(Role.Admin)

        ) {
            return true;
        }
        return false;
    }
}