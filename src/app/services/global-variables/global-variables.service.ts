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
            this.http.get<response.globalVariables.Get>(url('/resources'), { params: { page } })
    };

    variable = {

        resourceUploadFromFileWithParams: (resourcePoolCode: string, file: File): Observable<any> =>
            this.http.post(url(`/resource-upload-from-file-with-params/${resourcePoolCode}`), formData({ file })),

        resourceUploadFromFile: (poolCode: string, file: File): Observable<response.globalVariable.resourceUploadFromFile> =>
            this.http.post<response.globalVariable.resourceUploadFromFile>(url(`/resource-upload-from-file`), formData({ poolCode, file })),

        resourceInExternalStorage: (poolCode: string, storageUrl: string): Observable<response.globalVariable.resourceInExternalStorage> =>
            this.http.post<response.globalVariable.resourceInExternalStorage>(url(`/resource-in-external-storage`), formData({ poolCode, storageUrl })),

        globalVariableDeleteCommit: (id: string): Observable<response.globalVariable.globalVariableDeleteCommit> =>
            this.http.post<response.globalVariable.globalVariableDeleteCommit>(url(`/global-variable-delete-commit`), formData({ id }))
    };
}