import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Processor } from './Processor';
import { ProcessorResult } from './ProcessorResult';
import { ProcessorsResult } from './ProcessorsResult';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';


const url = (s: string): string => `${environment.baseUrl}dispatcher${s}`;


@Injectable({ providedIn: 'root' })

export class ProcessorsService {
    constructor(private http: HttpClient) { }

    processors = {
        get: (page: string): Observable<ProcessorsResult> =>
            this.http.get<ProcessorsResult>(url(`/processors`), { params: { page } })
    };

    processor = {
        get: (id: string): Observable<ProcessorResult> =>
            this.http.get<ProcessorResult>(url(`/processor/${id}`)),

        form: (station: Processor): Observable<ProcessorResult> =>
            this.http.post<ProcessorResult>(url(`/processor-form-commit/`), station),

        delete: (id: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(url(`/processor-delete-commit`), formData({ id }))
    };
}