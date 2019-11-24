import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { user as userResponse } from './response';
import { User } from './User';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    constructor(
        private http: HttpClient,
    ) {}

    isAuth() {
        if (localStorage.getItem('user')) {
            if (this.getUserLifeTimeExpiration()) {
                this.logout();
                return false;
            }
            return true;
        }
        return false;
    }

    getUserRole() {
        const user: User = new User(JSON.parse(localStorage.getItem('user')));
        return user.getRoleSet();
    }

    login(username: string, password: string) {
        const url: string = environment.baseUrl + 'user';
        const token: string = 'Basic ' + btoa(username + ':' + password);
        const headers: HttpHeaders = new HttpHeaders({ Authorization: token });

        this.http.post(url, { username, password }, { headers })
            .subscribe((response: userResponse.get.Response) => {
                if (response.username) {
                    localStorage.setItem('user', JSON.stringify(Object.assign({}, response, { token })));
                }
            });
    }

    getUserLifeTimeExpiration(): boolean {
        if (environment.userLifeTime) {
            const userLifeTime: number = environment.userLifeTime;
            const last: number = parseInt(localStorage.getItem('__last'), 10) || 0;
            const now: number = Date.now();

            if (last === 0) {
                localStorage.setItem('__last', now.toString());
                return false;
            }

            if ((now - last) > userLifeTime) {
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
        localStorage.clear();
        sessionStorage.clear();
    }
}