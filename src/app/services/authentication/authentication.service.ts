import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '@src/app/app.reducers';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Authority, response } from './response';
import { Role } from './Role';
import { User } from './User';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    localStorageName = 'authenticationService';
    user: User;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store < IAppState >
    ) {
        this.store.subscribe((state: IAppState) => {
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
        const set: Set < Role > = new Set();
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
                .subscribe((response: response.User) => {
                    if (response.username) {
                        const data = Object.assign({}, response, { token });
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
            const last: number = parseInt(localStorage.getItem('__last'), 10) || 0;
            const now: number = Date.now();
            const passedTime: number = now - last;

            if (last === 0) {
                localStorage.setItem('__last', now.toString());
                return false;
            }

            if (passedTime > userLifeTime) {
                return true;
            } else {
                localStorage.setItem('__last', now.toString());
                return false;
            }
        } else {
            return false;
        }
    }

    logout() {
        return new Observable(subscriber => {
            localStorage.clear();
            sessionStorage.clear();
            this.user = null;
            this.router.navigate(['/']);
            subscriber.next();
            subscriber.complete();
        });
    }
}