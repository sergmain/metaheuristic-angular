import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { AccountResult } from './AccountResult';
import { AccountsResult } from './AccountsResult';
import { NewAccount } from './NewAccount';
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from '@angular/forms';

const url = (s: string): string => `${environment.baseUrl}dispatcher/account/${s}`;

@Injectable({ providedIn: 'root' })
export class AccountsService {
    constructor(private http: HttpClient) { }

    accounts(page: string): Observable<AccountsResult> {
        return this.http.get<AccountsResult>(url(`accounts`), { params: { page } });
    }

    addFormCommit(account: ɵTypedOrUntyped<{ password: FormControl<string | null>; publicName: FormControl<string | null>; password2: FormControl<string | null>; username: FormControl<string | null> }, ɵFormGroupValue<{ password: FormControl<string | null>; publicName: FormControl<string | null>; password2: FormControl<string | null>; username: FormControl<string | null> }>, any>): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`account-add-commit`), account);
    }

    getAccount(id: string): Observable<AccountResult> {
        return this.http.get<AccountResult>(url(`account/${id}`));
    }

    editFormCommit(id: string, publicName: string, enabled: boolean): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`account-edit-commit`), formData({ id, publicName, enabled }));
    }

    roleFormCommit(accountId: string, roles: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`account-role-commit`), formData({ accountId, roles }));
    }

    passwordEditFormCommit(id: string, password: string, password2: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`account-password-edit-commit`), formData({ id, password, password2 }));
    }
}
