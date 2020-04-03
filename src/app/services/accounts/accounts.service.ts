import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { response } from './response';

const url = (s: string): string => `${environment.baseUrl}dispatcher/account${s}`;



@Injectable({ providedIn: 'root' })
export class AccountsService {

    constructor(
        private http: HttpClient
    ) { }

    accounts = {
        get: (page: string): Observable<response.accounts.Get> =>
            this.http.get<response.accounts.Get>(url(`/accounts`), { params: { page } })
    };

    account = {
        get: (id: string | number): Observable<response.account.Get> =>
            this.http.get<response.account.Get>(url(`/account/${id}`)),

        addCommit: (account: object): Observable<object> =>
            this.http.post(url(`/account-add-commit`), account),

        editCommit: (id: string, publicName: string, enabled: boolean): Observable<object> =>
            this.http.post(url(`/account-edit-commit`), formData({ id, publicName, enabled })),

        passwordEditCommit: (id: string, password: string, password2: string): Observable<object> =>
            this.http.post(url(`/account-password-edit-commit`), formData({ id, password, password2 })),

        roleCommit: (accountId: string, roles: string): Observable<object> =>
            this.http.post(url(`/account-role-commit`), formData({ accountId, roles }))
    };
}