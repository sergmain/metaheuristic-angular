import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData as formData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { ExecContextResult } from './ExecContextResult';
import { ExecContextsResult } from './ExecContextsResult';
import { SimpleExecContextAddingResult } from './SimpleExecContextAddingResult';
import { SourceCodeResult } from './SourceCodeResult';
import { SourceCodesResult } from './SourceCodesResult';
import { SourceCodeType } from '@src/app/enums/SourceCodeType';
import { ExecContextStateResult } from './ExecContextStateResult';

const url = (urlString): string => `${environment.baseUrl}dispatcher/source-code/${urlString}`;

@Injectable({
    providedIn: 'root'
})
export class SourceCodesService {
    constructor(
        private http: HttpClient
    ) { }

    sourceCodes = {
        get: (page: string): Observable<SourceCodesResult> =>
            this.http.get<SourceCodesResult>(
                url('source-codes'),
                { params: { page } }
            ),
        getArchivedOnly: (page: string): Observable<SourceCodesResult> =>
            this.http.get<SourceCodesResult>(
                url('source-codes-archived-only'),
                { params: { page } }
            )
    };

    sourceCode = {
        get: (id: string): Observable<SourceCodeResult> =>
            this.http.get<SourceCodeResult>(url(`source-code/${id}`)),

        validate: (id: string): Observable<SourceCodeResult> =>
            this.http.get<SourceCodeResult>(url(`source-code-validate/${id}`)),

        add: (source: string): Observable<SourceCodeResult> =>
            this.http.post<SourceCodeResult>(
                url(`source-code-add-commit`),
                formData({ source })
            ),

        edit: (sourceCodeId: string, source: string): Observable<SourceCodeResult> =>
            this.http.post<SourceCodeResult>(
                url(`source-code-edit-commit`),
                formData({ sourceCodeId, source })
            ),

        delete: (id: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(
                url(`source-code-delete-commit`),
                formData({ id })
            ),

        archive: (id: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(
                url(`source-code-archive-commit`),
                formData({ id })
            ),

        uploadFromFile: (file: File): Observable<SourceCodeResult> =>
            this.http.post<SourceCodeResult>(
                url(`source-code-upload-from-file`),
                formData({ file })
            )
    };

    execContexts = {
        get: (sourceCodeId: string, page: string): Observable<ExecContextsResult> =>
            this.http.get<ExecContextsResult>(
                url(`exec-contexts/${sourceCodeId}`),
                { params: { page } }
            ),
    };

    execContext = {
        uidExecContextAddCommit: (uid: string, variable: string): Observable<SimpleExecContextAddingResult> =>
            this.http.post<SimpleExecContextAddingResult>(
                url(`uid-exec-context-add-commit`),
                formData({ uid, variable })
            ),

        addCommit: (sourceCodeId: string, variable: string): Observable<ExecContextResult> =>
            this.http.post<ExecContextResult>(
                url(`exec-context-add-commit`),
                formData({ sourceCodeId, variable })
            ),

        get: (sourceCodeId: string, execContextId: string): Observable<ExecContextResult> =>
            this.http.get<ExecContextResult>(url(`exec-context/${sourceCodeId}/${execContextId}`)),

        deleteCommit: (sourceCodeId: string, execContextId: string): Observable<OperationStatusRest> =>
            this.http.post<OperationStatusRest>(
                url(`exec-context-delete-commit/`),
                formData({ sourceCodeId, execContextId })
            ),

        execContextState: (sourceCodeId: string, execContextId: string): Observable<ExecContextStateResult> =>
            this.http.get<ExecContextStateResult>(url(`exec-context-state/${sourceCodeId}/${execContextId}`)),

        execContextTargetState: (sourceCodeId: string, state: string, id: string): Observable<OperationStatusRest> =>
            this.http.get<OperationStatusRest>(url(`exec-context-target-state/${sourceCodeId}/${state}/${id}`))
    };

    getSourceCodeType(uid: string, result: SourceCodesResult): SourceCodeType {
        let type: SourceCodeType = SourceCodeType.common;
        if (result.batches.includes(uid)) { type = SourceCodeType.batch; }
        if (result.experiments.includes(uid)) { type = SourceCodeType.experiment; }
        return type;
    }
}
