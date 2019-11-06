import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings/settings.service';
import { environment } from '@src/environments/environment';
import { user as userResponse } from './response';
import { User } from './User';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    deafultTimeExpires: number = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService
    ) {}

    isAuth() {
        if (this.getUserLifeTimeExpired()) {
            this.logout();
            return false;
        }

        if (localStorage.getItem('user')) {
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

    getUserLifeTimeExpired(): boolean {
        const userLifetime: number = environment.userLifetime || this.deafultTimeExpires;
        const last: number = parseInt(localStorage.getItem('__last'), 10) || 0;
        const now: number = Date.now();

        if (last === 0) {
            localStorage.setItem('__last', now.toString());
            return false;
        }

        if ((now - last) > userLifetime) {
            return true;
        } else {
            localStorage.setItem('__last', now.toString());
            return false;
        }

    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
    }
}