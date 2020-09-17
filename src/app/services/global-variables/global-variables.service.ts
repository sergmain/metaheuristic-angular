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

    getResources(page: string): Observable<GlobalVariablesResult> {
        return this.http.get<GlobalVariablesResult>(url('/global-variables'), { params: { page } });
    }

    createResourceFromFile(variable: string, file: File): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/global-variable-upload-from-file`), formData({ variable, file }));
    }

    registerResourceInExternalStorage(variable: string, params: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/global-variable-in-external-storage`), formData({ variable, params }));
    }

    get(id: string): Observable<GlobalVariableResult> {
        return this.http.get<GlobalVariableResult>(url('/global-variable/' + id));
    }

    deleteResource(id: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(url(`/global-variable-delete-commit`), formData({ id }));
    }
}