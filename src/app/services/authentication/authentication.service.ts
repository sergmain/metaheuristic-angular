import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@src/app/app.reducers';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Role } from './Role';
import { User } from './User';
import * as settingsActions from '@src/app/services/settings/settings.actions';
import { Authority } from './Authority';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    localStorageName = 'authenticationService';
    userLifeTimeExpiredName = '__last';
    user: User;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<AppState>
    ) {
        this.store.subscribe((state: AppState) => {
            this.user = state.user;
        });
    }

    getData() {
        return new Observable(subscriber => {
            subscriber.next(this.getLocalStorageData());
            subscriber.complete();
        });
    }

    isAuth() {
        if (this.user && this.user.token) {
            if (this.userLifeTimeExpired()) {
                this.logout();
                return false;
            }
            return true;
        }
        return false;
    }

    getUserRole() {
        const set: Set<Role> = new Set();
        if (this.user && this.user.authorities) {
            this.user.authorities.forEach((authority: Authority) => {
                set.add(authority.authority);
            });
        }
        return set;
    }

    getToken() {
        if (this.user) {
            return this.user.token;
        }
        return null;
    }

    login(username: string, password: string) {
        const url: string = environment.baseUrl + 'user';
        const token: string = 'Basic ' + btoa(username + ':' + password);
        const headers: HttpHeaders = new HttpHeaders({ Authorization: token });

        return new Observable(subscriber => {
            this.http
                .post(url, { username, password }, { headers })
                .subscribe((resultUser: User) => {
                    console.log('username: ' + (resultUser ? resultUser.username : 'resultUser is null'));
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

    getLocalStorageData() {
        return JSON.parse(localStorage.getItem(this.localStorageName));
    }

    setLocalStorageData(content: User) {
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

    logout() {
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