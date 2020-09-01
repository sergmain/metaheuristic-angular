import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { response } from './response';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';


const url = (urlString): string => `${environment.baseUrl}dispatcher/source-code/${urlString}`;

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

        add: (source: string): Observable<response.sourceCode.Add> =>
            this.http.post<response.sourceCode.Add>(url(`source-code-add-commit`), formData({ source })),

        edit: (sourceCodeId: string, source: string): Observable<response.sourceCode.Edit> =>
            this.http.post<response.sourceCode.Edit>(url(`source-code-edit-commit`), formData({ sourceCodeId, source })),

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
        uidExecContextAddCommit: (uid: string, variable: string): Observable<response.execContext.UidExecContextAddCommit> =>
            this.http.post<response.execContext.UidExecContextAddCommit>(url(`uid-exec-context-add-commit`), formData({ uid, variable })),

        addCommit: (sourceCodeId: string, variable: string): Observable<response.execContext.AddCommit> =>
            this.http.post<response.execContext.AddCommit>(url(`exec-context-add-commit`), formData({ sourceCodeId, variable })),

        get: (sourceCodeId: string, execContextId: string): Observable<response.execContext.Get> =>
            this.http.get<response.execContext.Get>(url(`exec-context/${sourceCodeId}/${execContextId}`)),

        deleteCommit: (sourceCodeId: string, execContextId: string): Observable<response.execContext.DeleteCommit> =>
            this.http.post<response.execContext.DeleteCommit>(url(`exec-context-delete-commit/`), formData({ sourceCodeId, execContextId })),

        targetExecState: (sourceCodeId: string, state: string, id: string): Observable<response.execContext.TargetExecState> =>
            this.http.get<response.execContext.TargetExecState>(url(`exec-context-target-state/${sourceCodeId}/${state}/${id}`))
    };
}
