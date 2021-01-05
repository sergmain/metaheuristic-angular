import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService, Role } from '../services/authentication';

@Injectable({
    providedIn: 'root'
})
export class RoleRouteGuard implements CanActivate {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!environment.production) {
            console.log('');
            console.log('%c%s', 'color:orange;', state.url);
            console.log('%c%s', 'color:blue;',
                'requiredRoles: ',
                this.authenticationService.convertRolesToString(route.data.requiredRoles)
            );
            console.log(
                '%c%s', 'color:blue;',
                this.authenticationService.user.username + ': ',
                this.authenticationService.convertRolesToString(
                    this.authenticationService.user?.authorities?.map(v => v.authority)
                )
            );
            console.log('');
        }

        let check: boolean = false;
        const roles: Set<Role> = this.authenticationService.getUserRole();
        (route.data?.requiredRoles as Array<Role>)?.forEach(role => {
            if (roles.has(role)) {
                check = true;
            }
        });
        return check;
    }
}
