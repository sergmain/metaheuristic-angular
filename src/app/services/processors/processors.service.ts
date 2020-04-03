import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Processor } from './Processor';
import { response } from './response';

const url = (s: string): string => `${environment.baseUrl}dispatcher${s}`;


@Injectable({ providedIn: 'root' })

export class ProcessorsService {
    constructor(private http: HttpClient) { }

    processors = {
        get: (page: string): Observable<response.processors.Get> =>
            this.http.get<response.processors.Get>(url(`/processors`), { params: { page } })
    };

    processor = {
        get: (id: string): Observable<response.processor.Get> =>
            this.http.get<response.processor.Get>(url(`/processor/${id}`)),

        form: (station: Processor): Observable<any> =>
            this.http.post(url(`/processor-form-commit/`), station),

        delete: (id: string): Observable<any> =>
            this.http.post(url(`/processor-delete-commit`), formData({ id }))
    };
}