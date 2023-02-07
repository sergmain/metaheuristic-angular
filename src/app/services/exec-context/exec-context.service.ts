import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateFormData } from '@app/helpers/generateFormData';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { ExecContextResult } from '@app/services/source-codes/ExecContextResult';
import { ExecContextsResult } from '@app/services/source-codes/ExecContextsResult';
import { ExecContextStateResult } from '@app/services/source-codes/ExecContextStateResult';
import { SimpleExecContextAddingResult } from '@app/services/source-codes/SimpleExecContextAddingResult';
import { TaskExecInfo } from '@app/services/exec-context/TaskExecInfo';


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



    // @GetMapping("/exec-context-task-exec-info/{sourceCodeId}/{execContextId}/{taskId}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'DATA', 'MANAGER', 'OPERATOR')")
    // public ExecContextApiData.TaskExecInfo taskExecInfo(@PathVariable Long sourceCodeId, @PathVariable Long execContextId, @PathVariable Long taskId, Authentication authentication) {
    //     DispatcherContext context = userContextService.getContext(authentication);
    //     ExecContextApiData.TaskExecInfo execContextState = execContextTopLevelService.getTaskExecInfo(sourceCodeId, execContextId, taskId);
    //     return execContextState;
    // }
    taskExecInfo(sourceCodeId: string, execContextId: string, taskId: string): Observable<TaskExecInfo> {
        return this.http.get<TaskExecInfo>(url(`exec-context-task-exec-info/${sourceCodeId}/${execContextId}/${taskId}`));
    }


    downloadVariable(execContextId: string, variableId: string): Observable<HttpResponse<Blob>> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/octet-stream');
        return this.http.get(url(`exec-context/${execContextId}/download-variable/${variableId}`), {
            headers,
            observe: 'response',
            responseType: 'blob'
        });
    }
}
