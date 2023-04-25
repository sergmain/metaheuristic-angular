import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Authority } from './Authority';
import { Role } from './Role';
import { User } from './User';

export class AuthenticationServiceEventLogin { }
export class AuthenticationServiceEventLogout { }
export class AuthenticationServiceEventChange {
    user: User;
    constructor(user: User) { this.user = JSON.parse(JSON.stringify(user)); }
}
export type AuthenticationServiceEvent = AuthenticationServiceEventLogin | AuthenticationServiceEventLogout | AuthenticationServiceEventChange;


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private localStorageName: string = 'authenticationService';
    private userLifeTimeExpiredName: string = '__last';
    user: User;
    events: BehaviorSubject<AuthenticationServiceEvent> = new BehaviorSubject(null);

    private static generateUserToken(username: string, password: string): string {
        return 'Basic ' + btoa(username + ':' + password);
    }

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        this.user = this.getLocalStorageData();
        this.events.next(new AuthenticationServiceEventChange(this.user));

    }

    private updateData(user: User): void {
        this.user = user;
        this.setLocalStorageData(user);
        this.events.next(new AuthenticationServiceEventChange(user));
    }


    convertRolesToString(roles?: Role[]): string {
        return roles.map(role => {
            const s: string[] = role.replace('ROLE_', '')
                .toLowerCase()
                .split('_')
                .map(v => {
                    const ss: string[] = [...v];
                    ss[0] = ss[0].toUpperCase();
                    return ss.join('');
                });
            return s.join('');
        }).join(', ');
    }

    getData(): Observable<User> {
        return new Observable<User>(subscriber => {
            subscriber.next(this.getLocalStorageData() as User);
            subscriber.complete();
        });
    }

    isAuth(): boolean {
        if (this.user && this.user.token) {
            if (this.isUserLifeTimeExpired()) {
                this.logout();
                return false;
            }
            return true;
        }
        return false;
    }

    getUserRole(): Set<Role> {
        const set: Set<Role> = new Set();
        if (this.user && this.user.authorities) {
            this.user.authorities.forEach((authority: Authority) => {
                set.add(authority.authority);
            });
        }
        return set;
    }

    getToken(): string {
        return this.user?.token;
    }

    login(username: string, password: string): void {
        const url: string = environment.baseUrl + 'user';
        const token: string = AuthenticationService.generateUserToken(username, password);
        const headers: HttpHeaders = new HttpHeaders({ Authorization: token });
        this.http
            .post(url, { username, password }, { headers })
            .subscribe((user: User) => {
                if (user.username) {
                    this.events.next(new AuthenticationServiceEventLogin());
                    this.updateData(Object.assign({}, user, { token }));
                    this.aboutUser().log();
                }
            });
    }

    private getLocalStorageData(): User {
        return JSON.parse(localStorage.getItem(this.localStorageName)) as User;
    }

    private setLocalStorageData(content: User): void {
        localStorage.setItem(this.localStorageName, JSON.stringify(content));
    }


    isUserLifeTimeExpired(): boolean {
        if (environment.userLifeTime) {
            const userLifeTime: number = environment.userLifeTime;
            const last: number = parseInt(localStorage.getItem(this.userLifeTimeExpiredName), 10) || 0;
            const now: number = Date.now();
            const passedTime: number = now - last;

            if (last === 0) {
                localStorage.setItem(this.userLifeTimeExpiredName, now.toString());
                return false;
            }

            if (passedTime > userLifeTime) {
                localStorage.removeItem(this.userLifeTimeExpiredName);
                return true;
            } else {
                localStorage.setItem(this.userLifeTimeExpiredName, now.toString());
                return false;
            }
        } else {
            return false;
        }
    }

    logout(): Observable<null> {
        return new Observable(subscriber => {
            localStorage.removeItem(this.localStorageName);
            localStorage.removeItem(this.userLifeTimeExpiredName);
            sessionStorage.clear();
            this.events.next(new AuthenticationServiceEventLogout());
            this.user = null;
            this.router.navigate(['/']);
            subscriber.next();
            subscriber.complete();
        });
    }

    private aboutUser(user?: User): { aboutStr: string, log: () => void } {
        user = user || this.user;
        const usernameAsString: string = user.username ? user.username : '';
        const rolesAsString: string = user.authorities ?
            this.convertRolesToString(user.authorities.map(v => v.authority)) : '';
        const aboutStr: string = `${usernameAsString}: ${rolesAsString}`;
        const log = () => {
            if (user && user.username) {
                console.log('%c%s', 'color:blue; font-size:125%', aboutStr);
            }
        };
        return { aboutStr, log };
    }

    isRoleManager(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MANAGER); }
    isRoleOperator(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_OPERATOR); }
    isRoleData(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_DATA); }

    isRoleServerRestAccess(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_SERVER_REST_ACCESS); }
    isRoleAssetRestAccess(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_ASSET_REST_ACCESS); }
    isRoleBilling(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_BILLING); }

    isRoleMasterAdmin(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MAIN_ADMIN); }
    isRoleMasterOperator(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MAIN_OPERATOR); }
    isRoleMasterSupport(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MAIN_SUPPORT); }
    isRoleMasterAssetManager(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MAIN_ASSET_MANAGER); }

    isRoleAdmin(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_ADMIN); }
}