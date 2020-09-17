import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@src/app/helpers/generateFormData';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { ExecContextResult } from '../source-codes/ExecContextResult';
import { ExecContextsResult } from '../source-codes/ExecContextsResult';
import { ExecContextStateResult } from '../source-codes/ExecContextStateResult';
import { SimpleExecContextAddingResult } from '../source-codes/SimpleExecContextAddingResult';


const url = (s: string): string => `${environment.baseUrl}dispatcher/source-code/${s}`;

@Injectable({
    providedIn: 'root'
})
export class ExecContextService {
    constructor(
        private http: HttpClient
    ) { }

    execContexts(sourceCodeId: string, page: string): Observable<ExecContextsResult> {
        return this.http.get<ExecContextsResult>(
            url(`exec-contexts/${sourceCodeId}`),
            { params: { page } }
        );
    }

    execContextAddCommitUID(uid: string, variable: string): Observable<SimpleExecContextAddingResult> {
        return this.http.post<SimpleExecContextAddingResult>(
            url(`uid-exec-context-add-commit`),
            generateFormData({ uid, variable })
        );
    }

    execContextAddCommit(sourceCodeId: string, variable: string): Observable<ExecContextResult> {
        return this.http.post<ExecContextResult>(
            url(`exec-context-add-commit`),
            generateFormData({ sourceCodeId, variable })
        );
    }

    execContextEdit(sourceCodeId: string, execContextId: string): Observable<ExecContextResult> {
        return this.http.get<ExecContextResult>(url(`exec-context/${sourceCodeId}/${execContextId}`));
    }

    execContextDeleteCommit(sourceCodeId: string, execContextId: string): Observable<OperationStatusRest> {
        return this.http.post<OperationStatusRest>(
            url(`exec-context-delete-commit/`),
            generateFormData({ sourceCodeId, execContextId })
        );
    }

    execContextTargetState(sourceCodeId: string, state: string, id: string): Observable<OperationStatusRest> {
        return this.http.get<OperationStatusRest>(url(`exec-context-target-state/${sourceCodeId}/${state}/${id}`));

    }

    execContextsState(sourceCodeId: string, execContextId: string): Observable<ExecContextStateResult> {
        return this.http.get<ExecContextStateResult>(url(`exec-context-state/${sourceCodeId}/${execContextId}`));
    }
}
