import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@src/environments/environment';
import {Observable} from 'rxjs';
import {SimpleAuthsResult} from './SimpleAuthsResult';
import {OperationStatusRest} from "@app/models/OperationStatusRest";
import {generateFormData} from "@app/helpers/generateFormData";
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {SimpleAuthResult} from "./SimpleAuthResult";


const url = (s: string): string => `${environment.baseUrl}dispatcher/auth/${s}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient
    ) { }

    getAuths(page: string): Observable<SimpleAuthsResult> {
        let newUrl = url('auths')
        console.log('AuthService.newUrl: ' + newUrl);
        return this.http.get<SimpleAuthsResult>(newUrl, {params: {page}});
    }

    getAuth(id: string): Observable<SimpleAuthResult> {
        return this.http.get<SimpleAuthResult>(url(`auth/${id}`));
    }

    authDeleteCommit(apiId: string): Observable<OperationStatusRest> {
        console.log("Delete AUTH params #"+ apiId);
        return this.http.post<OperationStatusRest>(url(`auth-delete-commit`), generateFormData({ id: apiId }));
    }

    addFormCommit(code: string, params: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`auth-add-commit`),
            generateFormData({
                code, params
            })
        );
    }

    editFormCommit = (id: string, params: string): Observable<OperationStatusRest> =>
        this.http.post<OperationStatusRest>(
            url(`auth-edit-commit`),
            generateFormData({
                authId: id, params
            }))

}