import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { Observable } from 'rxjs';
import { environment } from '@src/environments/environment';
import { response } from './response';

const url = (s: string): string => `${environment.baseUrl}dispatcher/global-variable${s}`;

@Injectable({ providedIn: 'root' })
export class GlobalVariablesService {
    constructor(
        private http: HttpClient
    ) { }

    variables = {
        get: (page: string): Observable<response.globalVariables.Get> =>
            this.http.get<response.globalVariables.Get>(url('/global-variables'), { params: { page } })
    };

    variable = {

        globalVariableUploadFromFile: (variable: string, file: File): Observable<response.globalVariable.globalVariableUploadFromFile> =>
            this.http.post<response.globalVariable.globalVariableUploadFromFile>(url(`/global-variable-upload-from-file`), formData({ variable, file })),

        globalVariableInExternalStorage: (variable: string, params: string): Observable<response.globalVariable.globalVariableInExternalStorage> =>
            this.http.post<response.globalVariable.globalVariableInExternalStorage>(url(`/global-variable-in-external-storage`), formData({ variable, params })),

        globalVariableDeleteCommit: (id: string): Observable<response.globalVariable.globalVariableDeleteCommit> =>
            this.http.post<response.globalVariable.globalVariableDeleteCommit>(url(`/global-variable-delete-commit`), formData({ id }))
    };
}