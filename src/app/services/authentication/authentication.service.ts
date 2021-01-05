import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { environment } from '@src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from './Role';
import { User } from './User';
import * as settingsActions from '@src/app/services/settings/settings.actions';
import { Authority } from './Authority';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    localStorageName: string = 'authenticationService';
    private userLifeTimeExpiredName: string = '__last';
    user: User;

    userDataChanges: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<AppState>
    ) {
        this.store.subscribe((state: AppState) => {
            if (this.user && !this.user.username) { this.aboutUser(state.user).log(); }
            this.user = state.user;
            this.userDataChanges.next(this.user);
        });
    }

    convertRolesToString(roles?: Role[]): string {
        return roles.map(role => {
            let s = role.replace('ROLE_', '')
                .toLowerCase()
                .split('_')
                .map(v => {
                    let ss = [...v];
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
            if (this.userLifeTimeExpired()) {
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
        if (this.user) {
            return this.user.token;
        }
        return null;
    }

    login(username: string, password: string): Observable<User> {
        const url: string = environment.baseUrl + 'user';
        const token: string = 'Basic ' + btoa(username + ':' + password);
        const headers: HttpHeaders = new HttpHeaders({ Authorization: token });

        return new Observable(subscriber => {
            this.http
                .post(url, { username, password }, { headers })
                .subscribe((resultUser: User) => {
                    if (resultUser.username) {
                        const data: User = Object.assign({}, resultUser, { token });
                        this.setLocalStorageData(data);
                        subscriber.next(data);
                    } else {
                        subscriber.next(null);
                    }
                    subscriber.complete();
                });
        });
    }

    getLocalStorageData(): User {
        return JSON.parse(localStorage.getItem(this.localStorageName)) as User;
    }

    setLocalStorageData(content: User): void {
        localStorage.setItem(this.localStorageName, JSON.stringify(content));
    }


    userLifeTimeExpired(): boolean {
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
        this.store.dispatch(settingsActions.setDefault());
        return new Observable(subscriber => {
            localStorage.removeItem(this.localStorageName);
            localStorage.removeItem(this.userLifeTimeExpiredName);
            sessionStorage.clear();
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

    isRoleMasterAdmin(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MASTER_ADMIN); }
    isRoleMasterOperator(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MASTER_OPERATOR); }
    isRoleMasterSupport(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MASTER_SUPPORT); }
    isRoleMasterAssetManager(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_MASTER_ASSET_MANAGER); }

    isRoleAdmin(): boolean { return this.user.authorities.map(a => a.authority).includes(Role.ROLE_ADMIN); }
}