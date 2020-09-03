import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { GlobalVariableResult } from './GlobalVariableResult';
import { GlobalVariablesResult } from './GlobalVariablesResult';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';


const url = (s: string): string => `${environment.baseUrl}dispatcher/global-variable${s}`;

@Injectable({ providedIn: 'root' })
export class GlobalVariablesService {
    constructor(
        private http: HttpClient
    ) { }

    variables = {
        get: (page: string): Observable<GlobalVariablesResult> =>
            this.http.get<GlobalVariablesResult>(url('/global-variables'), { params: { page } })
    };

    variable = {
        get: (id: string): Observable<GlobalVariableResult> =>
            this.http.get<GlobalVariableResult>(url('/global-variable/' + id)),

        uploadFromFile: (variable: string, file: File): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`/global-variable-upload-from-file`), formData({ variable, file })),

        inExternalStorage: (variable: string, params: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`/global-variable-in-external-storage`), formData({ variable, params })),

        deleteCommit: (id: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`/global-variable-delete-commit`), formData({ id }))
    };
}