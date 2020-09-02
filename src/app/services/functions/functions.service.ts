import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { response } from './response';


const url = (s: string): string => `${environment.baseUrl}dispatcher/function/${s}`;


@Injectable({ providedIn: 'root' })
export class FuncrionsService {
    constructor(
        private http: HttpClient
    ) { }

    functions = {
        get: (page: string): Observable<response.functions.Get> =>
            this.http.get<response.functions.Get>(url('functions'), { params: { page } })
    };

    function = {
        upload: (file: File): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url('function-upload-from-file'), formData({ file })),
        delete: (id: string): Observable<OperationStatusRest> =>
            this.http.get<OperationStatusRest>(url(`function-delete/${id}`))
    };
}