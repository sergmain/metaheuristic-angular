import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { response } from './response';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';


const url = (url): string => `${environment.baseUrl}dispatcher/source-code/${url}`;

@Injectable({
    providedIn: 'root'
})
export class SourceCodesService {

    constructor(
        private http: HttpClient
    ) { }

    sourceCodes = {
        get: (page: string): Observable<response.sourceCodes.Get> =>
            this.http.get<response.sourceCodes.Get>(url('source-codes'), { params: { page } }),
        getArchivedOnly: (page: string): Observable<response.sourceCodes.GetArchivedOnly> =>
            this.http.get<response.sourceCodes.GetArchivedOnly>(url('source-codes-archived-only'), { params: { page } })
    };

    sourceCode = {
        get: (id: string): Observable<response.sourceCode.Get> =>
            this.http.get<response.sourceCode.Get>(url(`source-code/${id}`)),

        validate: (id: string): Observable<response.sourceCode.Validate> =>
            this.http.get<response.sourceCode.Validate>(url(`source-code-validate/${id}`)),

        add: (sourceCodeYaml: string): Observable<response.sourceCode.Add> =>
            this.http.post<response.sourceCode.Add>(url(`source-code-add-commit`), formData({ sourceCodeYaml })),

        edit: (sourceCodeId: string, sourceCodeYaml: string): Observable<response.sourceCode.Edit> =>
            this.http.post<response.sourceCode.Edit>(url(`source-code-edit-commit`), formData({ sourceCodeId, sourceCodeYaml })),

        delete: (id: string): Observable<response.sourceCode.Delete> =>
            this.http.post<response.sourceCode.Delete>(url(`source-code-delete-commit`), formData({ id })),

        archive: (id: string): Observable<response.sourceCode.Archive> =>
            this.http.post<response.sourceCode.Archive>(url(`source-code-archive-commit`), formData({ id })),

        uploadFromFile: (file: any): Observable<response.sourceCode.Upload> =>
            this.http.post<response.sourceCode.Upload>(url(`source-code-upload-from-file`), formData({ file }))
    }; 

    execContexts = {
        get: (sourceCodeId: string, page: string): Observable<response.execContexts.Get> =>
            this.http.get<response.execContexts.Get>(url(`exec-contexts/${sourceCodeId}`), { params: { page } }),
    };

    execContext = {
        planCodeWorkbookAddCommit: (planCode: string, poolCode: string): Observable<response.execContext.PlanCodeWorkbookAddCommit> =>
            this.http.post<response.execContext.PlanCodeWorkbookAddCommit>(url(`plan-code-workbook-add-commit`), formData({ planCode, poolCode })),

        addCommit: (sourceCodeId: string | number, variable: string): Observable<response.execContext.AddCommit> =>
            this.http.post<response.execContext.AddCommit>(url(`exec-context-add-commit`), formData({ sourceCodeId, variable })),

        get: (sourceCodeId: string | number, execContextId: string | number): Observable<response.execContext.Get> =>
            this.http.get<response.execContext.Get>(url(`workbook/${sourceCodeId}/${execContextId}`)),

        deleteCommit: (sourceCodeId: string | number, execContextId: string | number): Observable<response.execContext.DeleteCommit> =>
            this.http.post<response.execContext.DeleteCommit>(url(`workbook-delete-commit/`), formData({ sourceCodeId, execContextId })),

        targetExecState: (sourceCodeId: string, state: string, id: string): Observable<response.execContext.TargetExecState> =>
            this.http.get<response.execContext.TargetExecState>(url(`workbook-target-exec-state/${sourceCodeId}/${state}/${id}`))
    };
}
