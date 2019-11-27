import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as fd } from '@src/app/helpers/generateFormData';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { response } from './response';

@Injectable({ providedIn: 'root' })

export class PlansService {
    POST: any;
    GET: any;
    formData: any;

    constructor(private http: HttpClient) {
        const base: any = (url: string): string => `${environment.baseUrl}launchpad/plan${url}`;

        this.POST = (url: string, data: any): Observable < any >=> this.http.post(base(url), data);
        this.GET = (url: string): Observable < any > => this.http.get(base(url));
    }

    plans = {
        get: (page: string | number): Observable < response.plans.Get > =>
            this.GET(`/plans?page=${page}`),
        getArchivedOnly: (page: string | number): Observable < any > =>
            this.GET(`/plans-archived-only?page=${page}`)
    };

    plan = {
        get: (id: string | number): Observable < response.plan.Get > =>
            this.GET(`/plan/${id}`),

        validate: (id: string | number): Observable < any > =>
            this.GET(`/plan-validate/${id}`),

        add: (planYaml: string): Observable < any > =>
            this.POST(`/plan-add-commit`, fd({ planYaml })),

        edit: (planId: number, planYaml: string): Observable < any > =>
            this.POST(`/plan-edit-commit/`, fd({ planId, planYaml })),

        delete: (id: string | number): Observable < any > =>
            this.POST(`/plan-delete-commit?`, fd({ id })),

        archive: (id: string | number): Observable < any > =>
            this.POST(`/plan-archive-commit`, fd({ id })),

        uploadFromFile: (file: any): Observable < any > =>
            this.POST(`/plan-upload-from-file`, fd({ file }))

    };

    workbooks = {
        get: (planId: string | number, page: number | string): Observable < any > =>
            this.GET(`/workbooks/${planId}?page=${page}`),
    };

    workbook = {
        planCodeWorkbookAddCommit: (planCode: string, poolCode: string, inputResourceParams: string): Observable < any > =>
            this.POST(`/plan-code-workbook-add-commit`, fd({ planCode, poolCode, inputResourceParams })),

        addCommit: (planId: string | number, poolCode: string, inputResourceParams: string): Observable < any > =>
            this.POST(`/workbook-add-commit/`, fd({ planId, poolCode, inputResourceParams })),

        create: (planId: string | number, inputResourceParam: string): Observable < any > =>
            this.POST(`/workbook-create`, fd({ planId, inputResourceParam })),

        get: (planId: string | number, workbookId: string | number): Observable < any > =>
            this.GET(`/workbook/${planId}/${workbookId}`),

        deleteCommit: (planId: string | number, workbookId: string | number): Observable < any > =>
            this.POST(`/workbook-delete-commit/`, fd({ planId, workbookId })),

        targetExecState: (planId: string | number, state: string, id: string | number): Observable < any > =>
            this.GET(`/workbook-target-exec-state/${planId}/${state}/${id}`),
    };
}