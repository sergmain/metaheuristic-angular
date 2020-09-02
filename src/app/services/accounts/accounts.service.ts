import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { OperationStatusRest } from '../../models/OperationStatusRest';
import { AccountResult } from './AccountResult';
import { AccountsResult } from './AccountsResult';
import { NewAccount } from './NewAccount';

const url = (urlString: string): string => `${environment.baseUrl}dispatcher/account/${urlString}`;

@Injectable({ providedIn: 'root' })
export class AccountsService {
    constructor(private http: HttpClient) { }

    accounts = {
        get: (page: string): Observable<AccountsResult> =>
            this.http.get<AccountsResult>(url(`accounts`), {
                params: { page },
            }),
    };

    account = {
        get: (id: string): Observable<AccountResult> =>
            this.http.get<AccountResult>(url(`account/${id}`)),

        addCommit: (account: NewAccount): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`account-add-commit`), account),

        editCommit: (id: string, publicName: string, enabled: boolean): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`account-edit-commit`), formData({ id, publicName, enabled })),

        passwordEditCommit: (id: string, password: string, password2: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`account-password-edit-commit`), formData({ id, password, password2 })),

        roleCommit: (accountId: string, roles: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`account-role-commit`), formData({ accountId, roles })),
    };
}
