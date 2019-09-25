import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from './urls';

@Injectable({ providedIn: 'root' })
export class AccountsService {
    constructor(private http: HttpClient) {}

    accounts = {
        get: (page: number): Observable < object > => this.http.get(urls.accounts.get(page))
    };

    account = {
        get: (id: string | number): Observable < object > =>
            this.http.get(urls.account.get(id)),

        addCommit: (data: object): Observable < object > => {
            return this.http.post(urls.account.addCommit(), data);
        },

        editCommit: (id: string, publicName: string, enabled: boolean): Observable < object > => {
            const formData: FormData = new FormData();
            formData.append('id', id);
            formData.append('publicName', publicName);
            formData.append('enabled', enabled.toString());
            return this.http.post(urls.account.editCommit(), formData);
        },

        passwordEditCommit: (id: string, password: string, password2: string): Observable < object > => {
            const formData: FormData = new FormData();
            formData.append('id', id);
            formData.append('password', password);
            formData.append('password2', password2);
            return this.http.post(urls.account.passwordEditCommit(), formData)
        },

        roleCommit: (accountId: string, roles: string): Observable < object > => {
            const formData: FormData = new FormData();
            formData.append('accountId', accountId);
            formData.append('roles', roles);
            return this.http.post(urls.account.roleCommit(), formData)
        }
    };
}